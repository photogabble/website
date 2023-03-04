---
title: "awk command line for concatenating certificate file into string"
cite:
    name: Unknown
    href: #
---

I needed a way of converting a certificate file into a single string for inclusion in env variable this `awk` command did the job perfectly.

```bash
awk -v ORS='\\n' '1' id_rsa
```