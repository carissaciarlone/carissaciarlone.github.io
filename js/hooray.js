let hooray = (function () {

    let canvasEl = document.querySelector('.hooray');
    let ctx = canvasEl.getContext('2d');
    let numberOfParticules = Number(location.href.split('?')[1]) || 20;
    let pointerX = 0;
    let pointerY = 0;
    let tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
    let colors = [
        '#C44F80',
        '#B74BC3',
        '#62BF40',
        '#6D3295',
        '#85D6A0',
        '#D4C57D',
        '#C34B99',
        '#4A3BB0'
    ];

    function setCanvasSize() {
        canvasEl.width = window.innerWidth * 2;
        canvasEl.height = window.innerHeight * 2;
        canvasEl.style.width = window.innerWidth + 'px';
        canvasEl.style.height = window.innerHeight + 'px';
        canvasEl.getContext('2d').scale(2, 2);
    }

    function updateCoords(e) {
        pointerX = e.clientX || e.touches[0].clientX;
        pointerY = e.clientY || e.touches[0].clientY;
    }

    function setParticuleDirection(p) {
        let angle = anime.random(0, 360) * Math.PI / 180;
        let value = anime.random(50, 180);
        let radius = [-1, 1][anime.random(0, 1)] * value;
        return {
            x: p.x + radius * Math.cos(angle),
            y: p.y + radius * Math.sin(angle)
        }
    }

    function createParticule(x, y) {
        let p = {};
        p.x = x;
        p.y = y;
        p.color = colors[anime.random(0, colors.length - 1)];
        p.radius = anime.random(8, 16);
        p.endPos = setParticuleDirection(p);
        p.draw = function () {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
            ctx.fillStyle = p.color;
            ctx.fill();
        };
        return p;
    }

    function createCircle(x, y) {
        var p = {};
        p.x = x;
        p.y = y;
        p.color = '#FFF';
        p.radius = 0.1;
        p.alpha = .5;
        p.lineWidth = 6;
        p.draw = function () {
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
            ctx.lineWidth = p.lineWidth;
            ctx.strokeStyle = p.color;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        return p;
    }

    function renderParticule(anim) {
        for (var i = 0; i < anim.animatables.length; i++) {
            anim.animatables[i].target.draw();
        }
    }

    function animateParticules(x, y) {
        let circle = createCircle(x, y);
        let particules = [];
        for (var i = 0; i < numberOfParticules; i++) {
            particules.push(createParticule(x, y));
        }
        anime.timeline().add({
            targets: particules,
            x: function (p) {
                return p.endPos.x;
            },
            y: function (p) {
                return p.endPos.y;
            },
            radius: 0.1,
            duration: anime.random(1200, 1800),
            easing: 'easeOutExpo',
            update: renderParticule
        })
            .add({
                targets: circle,
                radius: anime.random(80, 160),
                lineWidth: 0,
                alpha: {
                    value: 0,
                    easing: 'linear',
                    duration: anime.random(600, 800),
                },
                duration: anime.random(1200, 1800),
                easing: 'easeOutExpo',
                update: renderParticule,
                offset: 0
            });
    }

    let render = anime({
        duration: Infinity,
        update: function () {
            ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        }
    });

    document.addEventListener(tap, function (e) {
        window.human = true;
        render.play();
        updateCoords(e);
        animateParticules(pointerX, pointerY);
    }, false);

    window.addEventListener('resize', setCanvasSize, false);

    return {
        render: render,
        setCanvasSize: setCanvasSize,
        animateParticules: animateParticules
    }

})();
