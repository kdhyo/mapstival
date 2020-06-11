$(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".ScrollButton").fadeIn();
    } else {
      $(".ScrollButton").fadeOut();
    }
  });

  $("#TopButton").click(function () {
    $("html").animate({ scrollTop: 0 }, 600);
  });

  $("#BottomButton").click(function () {
    $("html").animate({ scrollTop: $("#footer").offset().top }, 600);
  });
});
