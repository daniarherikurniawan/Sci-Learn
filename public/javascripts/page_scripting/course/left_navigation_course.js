
  $('.has-sub').click( function(e) {
    if ($(this).parent().hasClass('tap') ){
      $(this).parent().removeClass('tap');
    }else{
      $('li').each( function(e) {
        $(this).removeClass('tap');
      });
      $(this).parent().toggleClass('tap');
    }
      e.preventDefault();
  });

  $('div#main').ready(function () {
      $('div#main').on("scroll", onScroll);
  });
        // $('a[href*="week_1"]').addClass("active");

function onScroll(event){
    // alert("cds")
    var scrollPos = $("div#main").scrollTop();
    // alert(scrollPos)
    $('div.weekly-material').each(function () {
        var currLink = $(this);

        /*genuine is thecontent of edited item*/
        if(currLink.attr('id') != '' && currLink.offset().top <= 100 && currLink.offset().top >= 50){
          $('a').each(function(){
            $(this).removeClass('active')
          })
          // alert('a#material_'+currLink.attr('id'))
          $('a#'+currLink.attr('id')).addClass("active");
        }
    });
}
// $("div#main").animate({ scrollTop: 700 }, "slow");
$('a.menu').on('click', function(){
  // alert("cds")
  // $(this).addClass("active");
  var currLink = $(this);
  // alert('div#'+currLink.attr('id')+'.weekly-material')
  var currWeekMaterial = $('div#'+currLink.attr('id')+'.weekly-material');
  $("div#main").animate({ scrollTop: ( currWeekMaterial.position().top) - 10}, "slow");
  // $("div#main").animate({ scrollTop: 0 }, "slow");
})
