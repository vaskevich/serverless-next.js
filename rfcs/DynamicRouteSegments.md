### Motivation

Nextjs 9 introduced [Dynamic Route segments](https://nextjs.org/blog/next-9#dynamic-route-segments) as per [this RFC](https://github.com/zeit/next.js/issues/7607).

What does this mean for this serverless plugin?

This is great news for local development when using this plugin. Currently, when you have [custom page routes](https://github.com/danielcondemarin/serverless-nextjs-plugin#custom-page-routing) you can't develop / test this locally, or at least properly, since the current serverless offline support is too limited. With dynamic routes support the users should be able to just run `next dev` and benefit from the development experience next provides, then is the plugin's job to provide feature parity when deploying onto AWS Lambda.

### Proposal

Given the following app:

```
pages/
├── [root].js
├── blog/
│ └── [id].js
├── customers/
│ ├── [customer]/
│ │ ├── [post].js
│ │ ├── index.js
│ │ └── profile.js
│ ├── index.js
│ └── new.js
├── index.js
└── terms.js
```

The plugin will automatically produce the following serverless page functions:

```yml
# [root.js]
path: /{root}
request:
  parameters:
    paths:
      root: true
```

```yml
# blog/[id].js
path: blog/{id}
request:
  parameters:
    paths:
      id: true
```

```yml
# customers/[customer]/[post].js
path: customers/{customer}/{post}.js
request:
  parameters:
    paths:
      customer: true
      post: true
```

```yml
# customers/[customer]/index.js
path: customers/{customer}
request:
  parameters:
    paths:
      customer: true
```

```yml
# customers/[customer]/profile.js
path: customers/{customer}/profile
request:
  parameters:
    paths:
      customer: true
```

```yml
# customers/index.js
path: customers
```

```yml
# customers/new.js
path: customers/new
```

```yml
# index.js
path: /
```

```yml
# terms.js
path: /terms
```

The option to provide custom page routes will be kept, but **it is recommended** you use next dynamic routes whenever possible instead.
