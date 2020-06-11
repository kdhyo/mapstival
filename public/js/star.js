// star rating
var starRating = function () {
  var $star = $(".star-input"),
    $result = $star.find("output>b");
  var $score = $star.find("output>input");
  $(document)
    .on("focusin", ".star-input>.input", function () {
      $(this).addClass("focus");
    })
    .on("focusout", ".star-input>.input", function () {
      var $this = $(this);
      setTimeout(function () {
        if ($this.find(":focus").length === 0) {
          $this.removeClass("focus");
        }
      }, 100);
    })
    .on("change", ".star-input :radio", function () {
      $score.val($(this).next().text());
      $result.text($(this).next().text());
    })
    .on("mouseover", ".star-input label", function () {
      $score.val($(this).text());
      $result.text($(this).text());
    })
    .on("mouseleave", ".star-input>.input", function () {
      var $checked = $star.find(":checked");
      if ($checked.length === 0) {
        $score.val("0");
        $result.text("0");
      } else {
        $score.val($checked.next().text());
        $result.text($checked.next().text());
      }
    });
};
starRating();
