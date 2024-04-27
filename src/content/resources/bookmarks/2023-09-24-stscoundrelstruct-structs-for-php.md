---
title: 'stscoundrel/struct: Structs for PHP'
tags:
  - Nifty Show and Tell
cite:
  name: 'Sampo Silvennoinen'
  href: https://github.com/stscoundrel/struct
---

While we wait for [[PHP: rfc:structs]] to make some traction there are other solutions that attempt to bring Structs to #PHP. This one by Sampo Silvennoinen provides an `AbstractStruct` class which can be extended to produce struct like behaviour. For example:

```php
class Employee extends AbstractStruct
{    
    public string $name;    
    public string $department;
    public int $salary;
}
```
