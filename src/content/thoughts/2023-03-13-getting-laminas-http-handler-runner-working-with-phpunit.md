---
title: Getting Laminas HttpHandlerRunner to play nice with PHPUnit
tags:
  - PHP
  - stage/budding
---


## Preface
At the beginning of this month I de-mothballed both my [[Tuppence|PHP microfamework: Tuppence]] project and the related [[Tuppence Boilerplate|Tuppence Boilerplate Project]]. In doing so started encountering the `Laminas\HttpHandlerRunner\Emitter\SapiEmitter` class throwing a `EmitterException` when invoked within PHPUnit:

```
Laminas\HttpHandlerRunner\Exception\EmitterException : Unable to emit response; headers already sent in /vendor/phpunit/phpunit/src/Util/Printer.php:138
```

This doesn't happen when the route being tested is run from a browser which makes me suspect that this is picking up PHPUnit's command line output.

## Cause
Looking into the stack trace I could see that the `EmitterException` was being thrown by `SapiEmitterTrait::assertNoPreviousOutput()` and quick look inside that function we can see it uses [headers_sent](https://www.php.net/manual/en/function.headers-sent.php) to check if headers have already been sent, throwing the exception if so.

```php
var_dump(headers_sent());
echo "Hello world".PHP_EOL;
var_dump(headers_sent());

// Outputs:
// bool(false)
// Hello World
// bool(true)
```

PHPUnit always outputs its version before running your tests, and it's this that is causing `headers_sent` to return true.

## Solution
The [[Minimalism|minimalist]] solution is to replace the `SapiEmitter` being used in your tests for a `TestEmitter` that implements the same `EmitterInterface` but doesn't do all the checks that break in a test environment. A benefit of using your own `TestEmitter` is that you can obtain the response and run assertions in your tests.

```php
<?php  
  
namespace App\Tests;  
  
use Psr\Http\Message\ResponseInterface;  
use Laminas\HttpHandlerRunner\Emitter\EmitterInterface;  
  
class TestEmitter implements EmitterInterface  
{  
    private ResponseInterface $response;  
  
    public function emit(ResponseInterface $response): bool  
    {  
        $this->response = $response;  
        return true;  
    }  
    public function getResponse(): ResponseInterface  
    {  
        return $this->response;  
    }}
}
```

I use this within the Tuppence Boilerplate inside its `BootsApp` extension of `TestCase` this then lets  me provide a couple of helpful assertions akin to those seen in Laravel:

```php
class BootsApp extends TestCase 
{
	// ...

	protected function runRequest(ServerRequest $request): string
	{
	    $this->app->run($request);
	    return (string)$this->emitter->getResponse()->getBody();
	}

	protected function assertResponseOk(): void
	{
	    $this->assertEquals(
		    200,
		    $this->emitter->getResponse()->getStatusCode()
	    );
	}
 
	protected function assertResponseCodeEquals($code = 200): void
	{
	    $this->assertEquals(
		    $code,
		    $this->emitter->getResponse()->getStatusCode()
	    );
	}
}
```
