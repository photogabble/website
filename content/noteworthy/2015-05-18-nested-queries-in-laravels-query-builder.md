---
title: Nested queries in Laravels Query Builder
cover_image: /img/nested-queries-in-laravel-eloquent.png
tags:
  - Programming
  - Laravel
  - ORM
  - PHP
growthStage: evergreen
---

Love them, or hate them: query builders and ORM's are the workhorses of modern web frameworks. Laravel, my framework of choice, comes packaged with the [Fluent](http://laravel.com/docs/4.2/queries) query builder and an ORM called [Eloquent](http://laravel.com/docs/4.2/eloquent). Both are tightly coupled within the framework, with the former being able to transparently hydrate the later.

The benefit of query builders over simply executing raw SQL is that you can abstract away the database engine almost entirely, for example swapping out MySQL for SQLite while using the same code. Unfortunately as is usually the case with benefits, there *is* a down side; not all database engines are built equal and so a query builder tends to abstract only the features that are available across all database engines that it supports. Because of this a query builder can quickly become a hindrance by adding unnecessary complexity when you attempt to do something even remotely *complex* such as the following example:

```sql
SELECT * FROM (
    SELECT
        `employees`.`id`,
        CONCAT(`employees`.`first_name`, ' ', `employees`.`last_name`) as `full_name`,
        `employees`.`phone_number`
        GROUP_CONCAT(`departments`.`name`) as `employees_departments`
    FROM `employees`
    INNER JOIN `employees_departments` ON `employees_departments`.`employee_id` = `employees`.`id`
    INNER JOIN `departments` ON `departments`.`id` = `employees_departments`.`department_id`
    WHERE
        `employees`.`deleted_at` IS NULL AND
        `employees`.`archived_at` IS NULL
    GROUP BY `employees`.`id`
) as `t`
WHERE `t`.`employees_departments` NOT LIKE '%fish%'
```

The above, while not being the most intricate example of MySQL that I could come up with, is sufficiently complex enough to make translating it to Laravels Fluent Query Builder impossible without some use of RAW query strings[^1] and some clever additional logic as shown below:

```php
$employees = Employee::select(
    'employees.id',
    DB::raw("CONCAT(`employees`.`first_name`, ' ', `employees`.`last_name`) as `full_name`"),
    'employees.phone_number',
    DB::raw("GROUP_CONCAT(`departments`.`name`) as `employees_departments`")
)
->join('employees_departments', 'employees_departments.employee_id', '=', 'employees.id')
->join('departments', 'departments.id', '=', 'employees_departments.departments_id')
->whereNull('employees.deleted_at')
->whereNull('employees.archived_at')
->groupby('employees.id')
->get();
```

In the initial raw SQL we use `GROUP_CONCAT` to concatenate all the linked department names into a single list for each employee record, this means that we can not add `employees_departments NOT LIKE '%fish%'` to the above Fluent built query because upon executing it will simply exclude joined `department` records with a `name` like "fish" rather than removing `employees` records that belong to a department with a `name` like "fish" &ndash; to do that you do need the outer query.

I have asked about this on IRC and seen a handful of postings on various forums during Google searches[^2] to be told that it is not possible to execute nested queries using Laravels query builder &ndash; something I now know to be only half wrong[^3].

While it is true that you can't write nested queries directly within Laravels Fluent Query Builder, you can use Fluent to build the inner query and then grab the built SQL and bindings from the `\Illuminate\Database\Query\Builder` object and add a raw query wrapper around it before injecting it into Eloquent via the `hydrateRaw` method like so:

```php
$employees = Employee::select(
    'employees.id',
    DB::raw("CONCAT(`employees`.`first_name`, ' ', `employees`.`last_name`) as `full_name`"),
    'employees.phone_number',
    DB::raw("GROUP_CONCAT(`departments`.`name`) as `employees_departments`")
)
->join('employees_departments', 'employees_departments.employee_id', '=', 'employees.id')
->join('departments', 'departments.id', '=', 'employees_departments.departments_id')
->whereNull('employees.deleted_at')
->whereNull('employees.archived_at')
->groupby('employees.id'); // Note the missing get()

/** @var \Illuminate\Database\Query\Builder $queryBuilderObj */
$queryBuilderObj      = $employees->getQuery();
$craftedSql           = $queryBuilderObj->toSql();
$craftedSqlParameters = $queryBuilderObj->getBindings();

$finalQuerySql        = "SELECT * FROM ( $craftedSql ) as `t`";
$employees            = Employees::hydrateRaw($finalQuerySql, $craftedSqlParameters);

/** @var \Illuminate\Support\Collection $employees */
$employees            = $employees->where('t.employees_departments', 'NOT LIKE', '%fish%') 
                      ->get();
```

The beauty in this method is that you can nest queries more than just one level deep if you need to, all the while using both Fluent and Eloquent. The downside is that you will tightly couple your code to one specific database engine (in this case MySQL) which may negatively impact testing: for example you may be using an in memory SQLite engine that doesn't support the full MySQL dialect and therefore renders the code un-testable.


[^1]: Or absolutely impossible if you're being a purist
[^2]: My research into this subject lead me to this [stack overflow question](http://stackoverflow.com/questions/530627/getting-a-pdo-query-string-with-bound-parameters-without-executing-it) and these two laravel.io threads [1](http://laravel.io/forum/03-05-2014-nested-query-in-from), [2](http://laravel.io/forum/03-31-2014-eloquent-fluent-subquery-select)
[^3]: This lack of functionality within the Query Builder is due to certain dialects of SQL supporting different things and the role of the Query Builder being to aid in the inter-operability of multiple database architectures it has to support the lowest common denominator of features
