# gldomelib

gldomelib ist ein spontan auf der #rpTen zusammengehacktes Framework, mit dem man Animationen für 360°-Fulldome-Projektionen entwickeln kann.

## Dokumentation

Dokumentation gibt es noch nicht :/ Aber es ist jede Hilfer herzlich willkommen!

Im Kern basiert das Framework auf [Three.js](http://threejs.org/docs/index.html), also einfach ne HTML-Seite mit WebGL.

Man bindet die aktuellste lib-Version ein, da steckt alles drin, auch three.js. Also nur die lib und fertig:

```
<script type="text/javascript" src="https://gldome.github.io/gldomelib/release/gldomelib_latest.min.js"></script>
```

Um das zu nutzen, muss man die Lib initialisieren und zwei Callback einrichten. In dem einen kann die Szene initialisiert werden. In dem anderen kann man pro Frame die Szene verändern, also z.B. für Animationen.

```
var dome = new GLDomeLib();

dome.on('init', function () {
	// Szene initialisieren, also z.B. hier die ganzen Objekte generieren
	var scene = this.scene;
})

dome.on('frame', function () {
	// Für Animationen
})
```

Den schnellsten Einstieg bekommt man wohl, wenn man sich den Beispiel-Code anschaut: <https://github.com/gldome/gldomelib/tree/gh-pages/examples>

Mit den fertigen Beispielen kann man hier spielen: <https://gldome.github.io/gldomelib/examples/>


## ... und dann?

Das Framework ist so gebaut, dass man sich die fertigen Animationen auf Desktop und Smartphone anschauen kann. Sobald der Bildschirm größer als 1500x1500 ist, schaltet die Kamera um auf eine Fischaugenprojektion, wie sie ein für eine Fulldome-Projektion benötigt wird.

Falls man mit seinem Werk zufrieden ist, kann man es sogar im großen #rpTen-Dome laufen lassen. \o/
