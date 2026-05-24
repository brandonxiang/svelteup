---
title: DEMO
revealOptions:
  transition: slide
---

<github-corner></github-corner>

<my-element name="svelteup"></my-element>

### The HTML Presentation Framework

<p>
    <small>Created by <a href="http://hakim.se">Hakim El Hattab</a> and <a href="https://github.com/hakimel/reveal.js/graphs/contributors">contributors</a></small>
</p>

---

## Hello There

reveal.js enables you to create beautiful interactive slide decks using HTML. This presentation will show you examples of what it can do.

---

<h2>Vertical Slides</h2>
Slides can be nested inside of each other.
<p>Use the <em>Space</em> key to navigate through all slides.</p>
<br>
<a href="#" class="navigate-down">
    <img width="178" height="238" data-src="https://s3.amazonaws.com/hakim-static/reveal-js/arrow.png" alt="Down arrow">
</a>

---

## Basement Level 1

<p>Nested slides are useful for adding additional detail underneath a high level horizontal slide.</p>

---

## Basement Level 2

<p>That's it, time to go back up.</p>
<br>
<a href="#/2">
    <img width="178" height="238" data-src="https://s3.amazonaws.com/hakim-static/reveal-js/arrow.png" alt="Up arrow" style="transform: rotate(180deg); -webkit-transform: rotate(180deg);">
</a>

---

## Slides

<p>
    Not a coder? Not a problem. There's a fully-featured visual editor for authoring these, try it out at <a href="https://slides.com" target="_blank">https://slides.com</a>.
</p>

---

<!-- .slide: data-auto-animate -->

<h2 data-id="code-title">Pretty Code</h2>
<pre data-id="code-animation"><code class="hljs" data-trim data-line-numbers>
    import React, { useState } from 'react';

    function Example() {
        const [count, setCount] = useState(0);

        return (
        ...
        );
    }

</code></pre>

<p>Code syntax highlighting courtesy of <a href="https://highlightjs.org/usage/">highlight.js</a>.</p>

---

<!-- .slide: data-auto-animate -->

<h2 data-id="code-title">Even Prettier Animations</h2>
<pre data-id="code-animation"><code class="hljs" data-trim data-line-numbers="|4,8-11|17|22-24">
    import React, { useState } from 'react';

    function Example() {
        const [count, setCount] = useState(0);

        return (
        <div/>
            <p/>You clicked {count} times</p/>
            <button onClick={() =/> setCount(count + 1)}/>
            Click me
            </button/>
        </div/>
        );
    }

    function SecondExample() {
        const [count, setCount] = useState(0);

        return (
        <div/>
            <p/>You clicked {count} times</p/>
            <button onClick={() =/> setCount(count + 1)}/>
            Click me
            </button/>
        </div/>
        );
    }

</code></pre>

---

<h2>Point of View</h2>
<p>
    Press <strong>ESC</strong> to enter the slide overview.
</p>
<p>Hold down the <strong>alt</strong> key (<strong>ctrl</strong> in Linux) and click on any element to zoom towards it using <a href="http://lab.hakim.se/zoom-js">zoom.js</a>. Click again to zoom back out.</p>
<p>(Use ctrl + click in Linux.)</p>

---

<!-- .slide: data-auto-animate data-auto-animate-easing="cubic-bezier(0.770, 0.000, 0.175, 1.000)" -->
<h2>Auto-Animate</h2>
<p>Automatically animate matching elements across slides with <a href="https://revealjs.com/auto-animate/">Auto-Animate</a>.</p>
<div class="r-hstack justify-center">
    <div data-id="box1" style="background: #999; width: 50px; height: 50px; margin: 10px; border-radius: 5px;"></div>
    <div data-id="box2" style="background: #999; width: 50px; height: 50px; margin: 10px; border-radius: 5px;"></div>
    <div data-id="box3" style="background: #999; width: 50px; height: 50px; margin: 10px; border-radius: 5px;"></div>
</div>

---

<!-- .slide: data-auto-animate data-auto-animate-easing="cubic-bezier(0.770, 0.000, 0.175, 1.000)" -->
<div class="r-hstack justify-center">
    <div data-id="box1" data-auto-animate-delay="0" style="background: cyan; width: 150px; height: 100px; margin: 10px;"></div>
    <div data-id="box2" data-auto-animate-delay="0.1" style="background: magenta; width: 150px; height: 100px; margin: 10px;"></div>
    <div data-id="box3" data-auto-animate-delay="0.2" style="background: yellow; width: 150px; height: 100px; margin: 10px;"></div>
</div>
<h2 style="margin-top: 20px;">Auto-Animate</h2>

---

<!-- .slide: data-auto-animate data-auto-animate-easing="cubic-bezier(0.770, 0.000, 0.175, 1.000)" -->
<div class="r-stack">
    <div data-id="box1" style="background: cyan; width: 300px; height: 300px; border-radius: 200px;"></div>
    <div data-id="box2" style="background: magenta; width: 200px; height: 200px; border-radius: 200px;"></div>
    <div data-id="box3" style="background: yellow; width: 100px; height: 100px; border-radius: 200px;"></div>
</div>
<h2 style="margin-top: 20px;">Auto-Animate</h2>

---

## Touch Optimized

Presentations look great on touch devices, like mobile phones and tablets. Simply swipe through your slides.

---

<!-- .slide: data-background="#dddddd"-->

## Slide Backgrounds

<p>
    Set <code>data-background="#dddddd"</code> on a slide to change the background color. All CSS color formats are supported.
</p>
<a href="#" class="navigate-down">
    <img class="r-frame" style="background: rgba(255,255,255,0.1);" width="178" height="238" data-src="https://static.slid.es/reveal/arrow.png" alt="Down arrow">
</a>

---

<!-- .slide: data-background="https://static.slid.es/reveal/image-placeholder.png" data-background-color="#000" -->

## Image Backgrounds

<pre><code class="hljs html">&lt;section data-background="image.png"&gt;</code></pre>

---

<!-- .slide: data-background="https://static.slid.es/reveal/image-placeholder.png" data-background-repeat="repeat" data-background-size="100px" data-background-color="#000"-->

<h2>Tiled Backgrounds</h2>
<pre><code class="hljs html" style="word-wrap: break-word;">&lt;section data-background="image.png" data-background-repeat="repeat" data-background-size="100px"&gt;</code></pre>

---

<!-- .slide: data-background-video="https://s3.amazonaws.com/static.slid.es/site/homepage/v1/homepage-video-editor.mp4" data-background-color="#000000" -->

<div style="background-color: rgba(0, 0, 0, 0.9); color: #fff; padding: 20px;">
    <h2>Video Backgrounds</h2>
    <pre><code class="hljs html" style="word-wrap: break-word;">&lt;section data-background-video="video.mp4,video.webm"&gt;</code></pre>
</div>

---

<!-- .slide: data-background="http://i.giphy.com/90F8aUepslB84.gif"-->

## ... and GIFs!

---

<!-- .slide: data-background-iframe="https://hakim.se" data-background-interactive -->

<div style="position: absolute; width: 40%; right: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.5), 0 5px 25px rgba(0,0,0,0.2); background-color: rgba(0, 0, 0, 0.9); color: #fff; padding: 20px; font-size: 20px; text-align: left;">
    <h2>Iframe Backgrounds</h2>
    <p>Since reveal.js runs on the web, you can easily embed other web content. Try interacting with the page in the background.</p>
</div>
