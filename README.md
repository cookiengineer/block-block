
# Block Block

Blocks user-hostile CSS properties and user-hostile JS listeners.


### Features

This simple browser extension blocks websites from using hostile CSS properties
that prevent the user from using a static or dynamic website. This extension
specifically targets websites that make the website unusable _unless_ the user
clicks on Accept in their Consent banners.

- Blocks `contextmenu` event blockers
- Blocks `wheel` / `mousewheel` event blockers
- Blocks `touchmove` event blockers
- Blocks `overflow: hidden` styles
- Blocks `filter: <filter>` styles
- Blocks `backdrop-filter: <filter>` styles
- Blocks `pointer-events: none` styles


### Motivation

This extension somewhat enforces compliance with EU GDPR law Article 6(1)(a)
and Article 7. A lot of websites violate those on purpose to force users into
clicking Consent on their Cookie banners.

Additionally, [Recital 32 GDPR](https://www.privacy-regulation.eu/en/recital-32-GDPR.htm)
states specifically:

```
Silence, pre-ticked boxes or inactivity should not constitute consent.
```


### License

AGPL-3.0

