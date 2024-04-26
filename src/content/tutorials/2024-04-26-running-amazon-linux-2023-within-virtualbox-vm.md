---
title: Running Amazon Linux 2023 within VirtualBox
tags: ["AL2023"]
growthStage: evergreen
---

This week I have been battling with getting a Laravel application deploying on #AWS Elastic Beanstalk and one of the issues I had was installing [php-gRPC](https://grpc.io/) via [pecl](https://pecl.php.net/) was taking _way_ too long due to it compiling from source thus timing out the deploy.

My solution to that conundrum was to build the `grpc.so` file on my computer and create a rpm package file to install it. In order to do so I would need to be able to run Amazon Linux 2023 within VirtualBox as that is what I have installed.


Finding disk images for Amazon Linux 2 was easy however, aws have hidden away the release images for Amazon Linux 2023, most likely because they want you to use docker. In my search I came across Rotan Hanrahan's post [Amazon Linux 2023 on VirtualBox](https://www.rotanhanrahan.com/2024/01/27/amazon-linux-2023-on-virtualbox) from January this year and while they link to the os images for release `2023.3.20240122.0` looking at the [most recent AL2023 release notes for version `2023.4.20240416`](https://docs.aws.amazon.com/linux/al2023/release-notes/relnotes-2023.4.20240416.html) I could make an educated guess that the disk images could be found at the same url Rotan shared but with the version changed:

https://cdn.amazonlinux.com/al2023/os-images/2023.4.20240416.0/

—

Rotan noted in January 2024 that aws didn't provide VirtualBox disk images. I can confirm that hasn't changed as of April 2024. This means that, at time of writing, Rotan's instructions are the best method for getting Amazon Linux 2023 booting within VirtualBox.

First you want to download the vmware `.ova` disk image and unpack it to obtain the `.vmdk` file it contains:

```shell
wget https://cdn.amazonlinux.com/al2023/os-images/2023.4.20240416.0/vmware/al2023-vmware_esx-2023.4.20240416.0-kernel-6.1-x86_64.xfs.gpt.ova
tar -xvf al2023-vmware_esx-2023.4.20240416.0-kernel-6.1-x86_64.xfs.gpt.ova

```

VirtualBox has tooling for converting `.vmdk` files into `.vdi`, a format it supports. This is done with the `clonemedium` command (in earlier versions of VirtualBox this was named `clonehd`) provided by the `VBoxManage` command line tool:

```shell
VBoxManage clonemedium al2023-vmware_esx-2023.4.20240416.0-kernel-6.1-x86_64.xfs.gpt-disk1.vmdk al2023-vmware_esx-2023.4.20240416.0-kernel-6.1-x86_64.xfs.gpt-disk1.vdi --format VDI
```

For first boot Amazon Linux 2023, much like its predecessor Amazon Linux 2, requires a [`cloud-init` configuration](https://docs.aws.amazon.com/linux/al2023/ug/seed-iso.html) `seed.iso` disk image attached as a _virtual CD-ROM_. For our purposes this image only needs to contain two files `meta-data` to set the hostname and `user-data` for configuring our user account.

The `meta-data` file can be the following one liner to set the machines hostname to `al2023`.

```yaml
local-hostname: al2023
```

The `user-data` file contains a little more, when copying the below replace `{ssh-key}` with the content of your public ssh key to allow you to ssh into the vm. Note, according to the cloud-init documentation this file must begin with `#cloud-config`  in order to be valid.

```yaml
#cloud-config
users:
  - default
  - name: ec2-user
ssh_authorized_keys:
  - {ssh-key}
```

> ℹ️ You can read more about the `user-data` format in [user data format documentation for cloud-init](https://cloudinit.readthedocs.io/en/23.4.1/explanation/format.html).

In the absence of a `network-config` file in the cloud-init configuration, Amazon Linux 2023 will default to DHCP on the first available interface. If you want to customise this see the [cloud-init networking config documentation](https://cloudinit.readthedocs.io/en/23.4.1/reference/network-config-format-v2.html) for details on how.

I'm on MacOS so I will be using `hdiutil` to create the `seed.iso` disk image from the above two files by placing them within a `seed_config` folder and running the following:

```shell
hdiutil makehybrid -o seed.iso -hfs -joliet -iso -default-volume-name cidata seed_config
```

On Linux you will likely have `mkisofs` or `genisoimage` available to you. For `mkisofs` you can cd into the `seed_config` folder and run the following to generate a iso image:

```shell
mkisofs -output seed.iso -volid cidata -joliet -rock user-data meta-data
```

—

With the main disk image in the right format for VirtualBox and a `seed.iso` for the NoCloud `cloud-init` first boot you can now create a new virtual machine in VirtualBox.

Amazon Linux is _like_ Fedora and so I set the operating system as Linux Fedora (64-bit) then give the machine 2048MB RAM and two processors. Finally when setting the hard disk select _"Use an existing Virtual Hard Disk File_ and the virtual disk file created by `clonemedium` should already be populated. If not click the folder icon to the right and use the add button above to do so.

Before powering the machine on for the first time open its settings and set the network adapter to _"Bridged Adapter"_ and attach the `seed.iso` as an IDE storage device.

—

Once the machine had booted I was able to remote into it by running `ssh ec2-user@al2023`

At this point you will now have Amazon Linux 2023 running within VirtualBox. You can unmount the `seed.iso` as it's no longer needed and I recommend creating a snapshot now so you can revert back to a fresh install easily in the future without having to repeat all these steps.
