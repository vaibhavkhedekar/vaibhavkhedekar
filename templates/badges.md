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
<h2 align="center">About</h2>
<p align="center">
    🛠️ Building with {{building | bold_list}}<br/>
    🌱 Learning {{learning | bold_list}}<br/>
    💬 Ask me about {{ask | bold_join}}
</p>
<h2 align="center">Tech stack</h2>
<p align="center">
    {{#each stack}}<img alt="{{name}}" src="{{url}}"/>
    {{/each}}
</p>
<h3 align="center">Currently learning</h3>
<p align="center">
    {{#each learning_stack}}<img alt="{{name}}" src="{{url}}"/>
    {{/each}}
</p>
<h2 align="center">Connect</h2>
<p align="center">
    {{#each social}}<a href="{{url}}"><img alt="{{text}}" src="{{badge}}"/></a>
    {{/each}}
</p>
