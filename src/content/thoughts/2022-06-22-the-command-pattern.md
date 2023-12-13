---
title: The Command Pattern
tags:
  - Programming
  - Laravel
  - Jetstream
  - Intertia
  - PHP
growthStage: seedling
---
After installing [Laravel Jetstream](https://jetstream.laravel.com/) I noticed the creation of a new `App\Actions` folder containing a handful of classes. Intrigued I had a poke around and saw that each class has a short action based name such as `CreateNewUser` and contains a single public method for the action being requested e.g `create(...)`.

This feels like felt like an implementation of the [Command pattern](https://en.wikipedia.org/wiki/Command_pattern) which is similar but not the same as how I often use [Laravel's custom form requests](https://laravel.com/docs/9.x/validation#form-request-validation).

I believe both JetStream and [Fortify](https://laravel.com/docs/9.x/fortify) are using these as a way of better giving control to host project maintainers because it's very easy to modify behaviour when the functionality is being loaded from your application's folder directly rather than hidden away inside the vendor folder.

As mentioned, I have written an extension to the Laravel `FormRequest` that gives me three abstract classes:

- `ActionRequest`
- `LookupRequest`
- `PersistFormRequest`

These three abstracts provide an interface for `execute`, `lookup` or `persist` public methods, that keeps calling consistent.

For example, I have an `PlayerEnqueueResearch` class that extends `PersistFormRequest` and a `PlayerPauseResearch` class that extends `ActionRequest`. Enqueuing a research item is done via `POST` while pausing is done via a `DELETE` request.

This makes for some nice skinny controller functions:

```php
public function pauseResearch(PlayerPauseResearch $request): JsonResponse|RedirectResponse  
{  
    $request->execute();  
  
    return $request->expectsJson()  
        ? new JsonResponse(null, 204)  
        : back();  
}

public function enqueueResearch(PlayerEnqueueResearch $request): JsonResponse|RedirectResponse  
{  
    return $request->expectsJson()  
        ? new JsonResponse($request->persist(), 201)  
        : back();  
}
```

When I first saw the action classes it did cross my mind that I should refactor my project into using its pattern however upon reflection I can see that I am already doing so and would end up rewriting some form validation and authorization logic that I get for free with extending the Laravel `FormRequest`.