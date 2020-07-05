$(document).ready(function(){
  $('.product-new').slick({
      dots: false,
      infinite: false,
      speed: 800,
      arrows: true,
      slidesToShow: 5,
      slidesToScroll: 5,
      waitForAnimate: true,
      prevArrow: $(".btn-prev-product-new"),
      nextArrow: $(".btn-next-product-new"),
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
  });

  $('.product-best-seller').slick({
      dots: false,
      infinite: false,
      speed: 800,
      arrows: true,
      waitForAnimate: false,
      slidesToShow: 5,
      slidesToScroll: 5,
      prevArrow: $(".btn-prev-product-best-seller"),
      nextArrow: $(".btn-next-product-best-seller"),
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
  });

  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: false,
    arrows: true,
    centerMode: false,
    focusOnSelect: true,
    responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
  });

  var cancel = false;
  $(".shopping-cart").hide();
  $("#cart, .shopping-cart").hover(function () {

      cancel = (cancel) ? false : true;
      if (!cancel) {
          $(".shopping-cart").hide();
      } else if (cancel) {
          $(".shopping-cart").show();
      }
  });

  $('.review.top.circle').circleProgress({
    startAngle: -1.55,
    size: 120,
    value: 0.20,
    emptyFill: '#ffa500',
    fill: {
      color: '#E3E3E3'
    }
  }).on('circle-animation-progress', function(event, progress) {
    $(this).find('strong').html(Math.round(188 * progress) + '<i>%</i>');
    $(this).find('ul li a i').html();
  });

  $('.review.middle.circle').circleProgress({
    startAngle: -1.55,
    size: 120,
    value: 0.15,
    emptyFill: '#E3E3E3',
    fill: {
      color: '#ffa500'
    }
  }).on('circle-animation-progress', function(event, progress) {
    $(this).find('strong').html(Math.round(38 * progress) + '<i>%</i>');
    $(this).find('ul li a i').html();
  })

  $('.review.less.circle').circleProgress({
    startAngle: -1.55,
    size: 120,
    value: 0.1,
    emptyFill: '#E3E3E3',
    fill: {
      color: '#ffa500'
    }
  }).on('circle-animation-progress', function(event, progress) {
    $(this).find('strong').html(Math.round(12 * progress) + '<i>%</i>');
    $(this).find('ul li a i').html();
  });

  $('.review.no-review.circle').circleProgress({
    startAngle: -1.55,
    size: 120,
    value: 0,
    emptyFill: '#E3E3E3',
    fill: {
      color: '#ffa500'
    }
  }).on('circle-animation-progress', function(event, progress) {
    $(this).find('strong').html(Math.round(0 * progress) + '<i>%</i>');
    $(this).find('ul li a i').html();
  });

});


// (function(){

//   $("#cart").on("click", function() {
//     $(".shopping-cart").fadeToggle( "fast");
//   });

// })();

$('.single-slider').slick({
  dots: true,
  infinite: false,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
});
