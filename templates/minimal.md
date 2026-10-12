<p align="center">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="./{{logo.dark}}">
        <img alt="{{name}} logo" src="./{{logo.light}}" width="{{logo.width}}"/>
    </picture>
</p>
<h1 align="center">{{name}}</h1>
<p align="center">
    {{tagline | join:"<br/>\n    "}}
</p>
<p align="center">
    {{#each status}}<img alt="{{alt}}" src="{{url}}"/>
    {{/each}}
</p>
<p align="center">
    {{#each social}}<a href="{{url}}"><img alt="{{name}}" width="28" src="{{icon}}"/></a>&nbsp;&nbsp;
    {{/each}}
</p>

<h2 align="center">About</h2>
<table align="center">
  <tr>
    <td>🛠️ <b>Building with</b></td>
    <td>{{building | join:" · "}}</td>
  </tr>
  <tr>
    <td>🌱 <b>Learning</b></td>
    <td>{{learning | join:" · "}}</td>
  </tr>
  <tr>
    <td>💬 <b>Ask me about</b></td>
    <td>{{ask_capitalized | join:" · "}}</td>
  </tr>
  <tr>
    <td>🌐 <b>Website</b></td>
    <td><a href="{{website}}">{{website_host}}</a></td>
  </tr>
  <tr>
    <td>📫 <b>Email</b></td>
    <td><a href="mailto:{{email}}">{{email}}</a></td>
  </tr>
</table>
<h2 align="center">Tools</h2>
<p align="center">
    <a href="https://skillicons.dev"><img alt="{{skillicons.alt}}" src="https://skillicons.dev/icons?i={{skillicons.ids}}&theme=dark"/></a>
</p>
