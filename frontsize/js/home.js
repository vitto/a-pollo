$(function () {

    // http://greensock.com/ease-visualizer
    // http://janpaepke.github.io/ScrollMagic/examples/expert/bezier_path_animation.html

    var logoEase, logoDuration, logoDelay, logoCurviness,
    sceneSelector, controller, scene,
    $lessLogo, lessPath, lessTween,
    $sassLogo, sassPath, sassTween,
    $css3Logo, css3Path, css3Tween,
    $mincerUpper, $mincerLower, mincerTween,
    pageElement2Path, pageElement3Path,
    $pageElement1, $pageElement2, $pageElement3,
    page1Tween, page2Tween, page3Tween, pageDownDuration, pageFlipDuration, pageEase;

    lessTween = new TimelineMax();
    sassTween = new TimelineMax();
    css3Tween = new TimelineMax();
    page1Tween = new TimelineMax();
    page2Tween = new TimelineMax();
    page3Tween = new TimelineMax();
    mincerTween = new TimelineMax();
    controller = new ScrollMagic.Controller();

    logoEase = Circ.easeInOut;
    logoDuration = 1.75;
    logoCurviness = 1.75;
    logoDelay = 0.2;

    pageEase = Expo.easeInOut;
    pageDownDuration = 2.5;
    pageFlipDuration = 3;

    $lessLogo = $("#logo-less");
    $sassLogo = $("#logo-sass");
    $css3Logo = $("#logo-css3");
    $mincerUpper = $("#mincer-upper");
    $mincerLower = $("#mincer-lower");
    $pageElement1 = $("#page-styleguide-1");
    $pageElement2 = $("#page-styleguide-2");
    $pageElement3 = $("#page-styleguide-3");
    sceneSelector = "#from-code-to-docs";

    lessPath = {
        curviness: logoCurviness,
        autoRotate: false,
        values: [
            {x: 0,   y: 0},
            {x: 150, y: 100},
            {x: 160, y: 170}
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
            {x: -160, y: 170}
        ]
    };

    pageElement2Path = {
        curviness: logoCurviness,
        autoRotate: false,
        values: [
            {x: 0,   y: 0},
            {x: -50, y: -5},
            {x: -100, y: -10}
        ]
    };

    pageElement3Path = {
        curviness: logoCurviness,
        autoRotate: false,
        values: [
            {x: 0,   y: 0},
            {x: 50, y: -5},
            {x: 100, y: -10}
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

    lessTween.add(TweenMax.to($lessLogo, 0.15, { css:{ opacity:0 }, ease:logoEase }));
    sassTween.add(TweenMax.to($sassLogo, 0.15, { css:{ opacity:0 }, ease:logoEase }));
    css3Tween.add(TweenMax.to($css3Logo, 0.15, { css:{ opacity:0 }, ease:logoEase }));

    page1Tween.add(TweenMax.to($pageElement1, pageDownDuration, {
        css:{
            y:140,
            scale: 0.5,
            zIndex: 5,
        }, ease:pageEase, delay: 1
    }));

    page2Tween.add(TweenMax.to($pageElement2, pageDownDuration, {
        css:{
            y:110,
            scale: 0.25,
            zIndex: 4,
            opacity: 0.6
        }, ease:pageEase, delay: 1
    }));

    page3Tween.add(TweenMax.to($pageElement3, pageDownDuration, {
        css:{
            y:110,
            scale: 0.25,
            zIndex: 3,
            opacity: 0.6
        }, ease:pageEase, delay: 1
    }));

    page1Tween.add(TweenMax.to($pageElement1, pageFlipDuration, {
        css:{
            scale: 1,
            y:0
        }, ease:pageEase
    }));

    page2Tween.add(TweenMax.to($pageElement2, pageFlipDuration, {
        css:{
            bezier:pageElement2Path,
            scale: 0.75,
            rotation: -10
        }, ease:pageEase, delay: 0.1
    }));

    page3Tween.add(TweenMax.to($pageElement3, pageFlipDuration, {
        css:{
            bezier:pageElement3Path,
            scale: 0.75,
            rotation: 10
        }, ease:pageEase, delay: 0.2
    }));

    mincerTween.add(TweenMax.to([$mincerUpper, $mincerLower], 0.1, { css:{ zIndex:1 }, ease:logoEase, delay: 3 }));

    mincerTween.add(TweenMax.to([$mincerUpper, $mincerLower], 2, { css:{ opacity:0 }, ease:logoEase, delay: 2 }));

    // build scene
    scene = new ScrollMagic.Scene(
        {
            triggerElement: sceneSelector,
            duration: 300,
            offset: 300
        }
    );
    scene.setPin(sceneSelector);
    scene.setTween([sassTween, lessTween, css3Tween, mincerTween, page1Tween, page2Tween, page3Tween]);
    // scene.addIndicators(); // add indicators (requires plugin)
    scene.addTo(controller);
});
