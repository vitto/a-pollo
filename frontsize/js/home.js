$(function () {

    // http://greensock.com/ease-visualizer
    // http://janpaepke.github.io/ScrollMagic/examples/expert/bezier_path_animation.html

    var logoEase, logoDuration, logoDelay, logoCurviness,
    sceneSelector, controller, scene,
    $lessLogo, lessPath, lessTween,
    $sassLogo, sassPath, sassTween,
    $css3Logo, css3Path, css3Tween;

    lessTween = new TimelineMax();
    sassTween = new TimelineMax();
    css3Tween = new TimelineMax();
    controller = new ScrollMagic.Controller();

    logoEase = Circ.easeInOut;
    logoDuration = 2;
    logoCurviness = 1.75;
    logoDelay = 0.2;

    $lessLogo = $("#logo-less");
    $sassLogo = $("#logo-sass");
    $css3Logo = $("#logo-css3");
    sceneSelector = "#from-code-to-docs";

    lessPath = {
        curviness: logoCurviness,
        autoRotate: false,
        values: [
            {x: 0,   y: 0},
            {x: 150, y: 100},
            {x: 200, y: 170}
        ]
    };

    sassPath = {
        curviness: logoCurviness,
        autoRotate: false,
        values: [
            {x: 0, y: 0},
            {x: 0, y: 170}
        ]
    };

    css3Path = {
        curviness: logoCurviness,
        autoRotate: false,
        values: [
            {x: 0,   y: 0},
            {x: -150, y: 100},
            {x: -200, y: 170}
        ]
    };



    lessTween.add(TweenMax.to($lessLogo, logoDuration, {
        css:{
            bezier:lessPath,
            scale: 0.25,
            rotation: 90
        }, ease:logoEase
    }));

    sassTween.add(TweenMax.to($sassLogo, logoDuration, {
        css:{
            bezier:sassPath,
            scale: 0.25
        }, ease:logoEase, delay: logoDelay
    }));

    css3Tween.add(TweenMax.to($css3Logo, logoDuration, {
        css:{
            bezier:css3Path,
            scale: 0.25,
            rotation: -90
        }, ease:logoEase, delay: logoDelay * 1.5
    }));

    // build scene
    scene = new ScrollMagic.Scene(
        {
            triggerElement: sceneSelector,
            duration: 500,
            offset: 300
        }
    );
    scene.setPin(sceneSelector);
    scene.setTween([sassTween, lessTween, css3Tween]);
    scene.addIndicators(); // add indicators (requires plugin)
    scene.addTo(controller);
});
