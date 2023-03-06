---
title: "awk command line for concatenating certificate file into string"
cite:
    name: Ed Morton via Stackoverflow
    href: https://stackoverflow.com/a/38674872/1225977
---

I needed a way of converting a certificate file into a single string for inclusion in env variable this `awk` command did the job perfectly.

```bash
awk -v ORS='\\n' '1' id_rsa
```