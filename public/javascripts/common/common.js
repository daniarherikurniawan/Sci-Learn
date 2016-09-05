  function calculateDiff(startDate) {
      endDate = new Date();
      var diff = endDate.getTime() - startDate.getTime();
      // console.log(diff)
      var days = Math.floor(diff / 1000 / 60 / 60 / 24);
      diff -= days * 1000 * 60 * 60 * 24;
      var hours = Math.floor(diff / 1000 / 60 / 60);
      diff -= hours * 1000 * 60 * 60;
      var minutes = Math.floor(diff / 1000 / 60);
      diff -= minutes * 1000 * 60;
      diff = Math.floor(diff / 1000);
      seconds = diff;
      if (days > 0)
        return  (days + " days ago");
      else if (hours > 0)
        return  (hours + " hours ago");
      else if (minutes > 0)
        return  (minutes + " minutes ago");
      else if (seconds < 15)
        return  ("Just now");
      else 
        return  (seconds + " seconds ago");
      
  }