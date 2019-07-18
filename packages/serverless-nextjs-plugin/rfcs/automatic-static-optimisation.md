### Motivation

Nextjs 9 introduced [Automatic Static Optimisation](https://nextjs.org/blog/next-9#automatic-static-optimization) as per [this RFC](https://github.com/zeit/next.js/issues/7355).

What does this mean for this serverless plugin?

This should reduce the number of Lambda functions provisioned by the plugin. Next 9 prerenders static pages as HTML files, which means this plugin could simply upload these to S3 and route the page requests via API Gateway or CloudFront.

### Proposal

Given the following app:

```
pages/
├── stars.js
└── about.js
```

```js
function Stars({ stars }) {
  return <main>Stars: {stars}</main>;
}

Stars.getInitialProps = async ({ req }) => {
  const res = await fetch("https://api.github.com/repos/zeit/next.js");
  const json = await res.json();
  return { stars: json.stargazers_count };
};

export default Stars;
```

```js
function About() {
  return <main>Simple static about page. No server side stuff happening</main>;
}

export default About;
```

The above app produces the following built pages:

.next/serverless/pages/stars.js
.next/serverless/pages/about.html

The plugin will upload `about.html` to the [assets bucket](https://github.com/danielcondemarin/serverless-nextjs-plugin#hosting-static-assets).
Requests to `/about` will be routed to S3 the same way [assets are currently served](https://github.com/danielcondemarin/serverless-nextjs-plugin#serving-static-assets) by the plugin.

Requests to `/stars` would work as per current behaviour.
