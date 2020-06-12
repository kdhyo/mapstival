$(function () {
  $("#TopButton").click(function () {
    $("html").animate({ scrollTop: 0 }, 600);
  });

  $("#BottomButton").click(function () {
    $("html").animate({ scrollTop: $("#footer").offset().top }, 600);
  });

  $("#HomeButton").click(function () {
    window.location = "/map";
  });

  $("#BackButton").click(function () {
    window.history.back();
  });
});
