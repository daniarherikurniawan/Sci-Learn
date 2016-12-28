  function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
  }

  // alert(document.getElementById('editableTemplate').innerHTML)
   var genuine = null;
   var button_id = null;
   var source_id = null;

  function edit(source_id_atr, content_id, url_target, button_id_atr){
    // alert(content_id)
    if (genuine == null){
      button_id = button_id_atr;
      source_id = source_id_atr;
      $('#needActionSingleColumnEdit').attr('action',url_target);
      $('#'+button_id).attr('style', 'display :none');
      var newValue = "cancelEdit('"+source_id+"')";
      $('#cancelButtonId').attr('onclick', newValue);
      document.getElementById('editableTextArea').innerHTML = document.getElementById(content_id).textContent;
      genuine = document.getElementById(source_id).innerHTML;
      document.getElementById(source_id).innerHTML =   document.getElementById('editableTemplate').innerHTML;
    }else{
      if (!isAddingNewWeeklyMaterial)
        window.alert("You should finish your current editing before edit another one! ")
      else
        window.alert("You should finish adding new weekly material before edit another one! ")
    }
  }

var data_json_material = null;
var isAddingNewWeeklyMaterial = false;
var templateHTML = '';
var is_id_edited_materials_changed = false;

function getNeededMaterialTemplate(data, id){
  // alert(data+"  "+id)
  template = ''
  template = "<div id='"+id+"_per_material' class=\"row\" style=\"margin-bottom: 8px\">"+
            "<div class=\"row\" style=\"margin: 5px\">"+
              "<div class=\"col-md-1\" style=\"width: 30px;\">"+
                "<i style=\"color: #2d6363;margin-right: 3px; font-size: 18px; top: 8px;\" title=\"Public Group\""+
                 "class='"
                if(data.is_video){
                 template +='glyphicon glyphicon-play'
                }else if( data.is_announcement){
                 template +='glyphicon glyphicon-bell'
                }else if( data.is_quiz){
                 template +='glyphicon glyphicon-star'
                }else if( data.is_file){
                 template +='glyphicon glyphicon-file'
                }
                template +="'></i>"+
              "</div>"+
              "<div class=\"col-md-2\" style=\" margin-top: 5px;\">"

                if(data.is_video){
                 template +='Video'
                }else if( data.is_announcement){
                 template += 'Announcement'
                }else if( data.is_quiz){
                 template +='Quiz'
                }else if( data.is_file){
                 template +='PDF File'
                }

              if(data.material_url == undefined)
                data.material_url = ''
              if(data.material_description == undefined)
                data.material_description = ''
              if(data.material_title == undefined)
                data.material_title = ''

              template +="</div>"

              if(data.is_announcement){
              template += "<div class=\"col-md-8\" style=\"margin-right: -8px; width: 60%;\">"+
                  "<textarea  maxlength=\"250\"  id ='"+id+"_desc'  name=\"material_video_title\" class=\"form-control auto-resize\""+
                  "placeholder=\"Announcement's note\"  required  style=\"height: 68px; padding: 8px 12px; \" >"+data.material_description+"</textarea>"+
              "</div>"+
            "</div>"
              }else{
              template += "<div class=\"col-md-8\" style=\"margin-right: -8px; width: 60%;\">"+
                  "<textarea  maxlength=\"50\"  id ='"+id+"_title'  name=\"material_video_title\" class=\"form-control auto-resize\""+
                  "placeholder=\"Material's title\"  required  style=\"height: 34px; padding: 8px 12px; \" >"+data.material_title+"</textarea>"+
              "</div>"+
               "<div style=\"text-align: right;\">"
                  if(data_json_material.length > 1){
                    if(id == 1){
                      template += "\n<button class=\" btn btn-md btn-primary\" title=\"Move material down\" onclick=\"moveDownMaterial("+id+")\"><i class=\"fa fa-chevron-down\"></i></button>"
                      template += "\n<button class=\" btn btn-md btn-danger\" title=\"Remove material\" onclick=\"removeMaterial("+id+")\"><i class=\"fa fa-times\"></i></button>"
                    }else if (id == data_json_material.length - 1){
                      template += "\n<button class=\" btn btn-md btn-primary\" title=\"Move material up\" onclick=\"moveUpMaterial("+id+")\"><i class=\"fa fa-chevron-up\"></i></button>"
                      template += "\n<button class=\" btn btn-md btn-danger\" title=\"Remove material\" onclick=\"removeMaterial("+id+")\"><i class=\"fa fa-times\"></i></button>"
                    }else{
                      template += "\n<button class=\" btn btn-md btn-primary\" title=\"Move material down\" onclick=\"moveDownMaterial("+id+")\"><i class=\"fa fa-chevron-down\"></i></button>"
                      template += "\n<button class=\" btn btn-md btn-primary\" title=\"Move material up\" onclick=\"moveUpMaterial("+id+")\"><i class=\"fa fa-chevron-up\"></i></button>"
                      template += "\n<button class=\" btn btn-md btn-danger\" title=\"Remove material\" onclick=\"removeMaterial("+id+")\"><i class=\"fa fa-times\"></i></button>"
                    }
                  }else{
                    if(id == 1){
                      template += "\n<button class=\" btn btn-md btn-danger\" title=\"Remove material\" onclick=\"removeMaterial("+id+")\"><i class=\"fa fa-times\"></i></button>"
                    }
                  }
              template += "</div>"+
            "</div>"+
            
          "<div class=\"row\" style=\"margin: 5px\">"+
              "<div class=\"col-md-1\" style=\"width: 30px;\">"+
              "</div>"+
              "<div class=\"col-md-2\">"+
                "</div>"+
                "<div class=\"col-md-8\"  style=\"width: 60%;\">"+
                  "<textarea  maxlength=\"100\"  id ='"+id+"_url'  name=\"video_url\" class=\"form-control auto-resize\""+
                  "placeholder=\"Material's URL (Youtube link / any other shared file url)\"  required style=\"height: 34px; padding: 8px 12px;\" >"+data.material_url+"</textarea>"+
              "</div>"+
          "</div>"+
          "<div class=\"row\" style=\"margin: 5px\">"+
              "<div class=\"col-md-1\" style=\"width: 30px;\">"+
              "</div>"+
              "<div class=\"col-md-2\">"+
                "</div>"+
                "<div class=\"col-md-8\" style=\"width: 60%;\">"+
                  "<textarea  maxlength=\"5000\"  id ='"+id+"_desc'  name=\"material_video_desc\" "+
                  "class=\"form-control auto-resize\" placeholder=\"Material's descriptions\"  required style=\"height: 102px;"+
                  " padding: 8px 12px; overflow: auto;\" >"+data.material_description+"</textarea>"+
              "</div>"+
          "</div>"
        }
         template+= "</div>\n\n" 

    /*id per materials is changed (not using id from server)*/
    if(id_edited_weekly_material != undefined){
      is_id_edited_materials_changed = true;
    }
    return template;

}

function removeMaterial(id){
  console.log(data_json_material)
  prepareParamsDataJsonMaterial()
  data_json_material.splice(id,1)
  if(id_edited_weekly_material == undefined)
    updateListEditableMaterials();
  else
    updateListEditableMaterials(id_edited_weekly_material);
}


function moveUpMaterial(id){
  prepareParamsDataJsonMaterial()
  temp = data_json_material[id - 1];
  data_json_material[id -1] = data_json_material[id];
  data_json_material[id] = temp;
  if(id_edited_weekly_material == undefined)
    updateListEditableMaterials();
  else
    updateListEditableMaterials(id_edited_weekly_material);
}


function moveDownMaterial(id){
  prepareParamsDataJsonMaterial()
  temp = data_json_material[id + 1];
  data_json_material[id +1] = data_json_material[id];
  data_json_material[id] = temp;
  if(id_edited_weekly_material == undefined)
    updateListEditableMaterials();
  else
    updateListEditableMaterials(id_edited_weekly_material);
}

function moveUpEditedMaterial(id_per_material){
  id = -1;
  prepareParamsDataJsonMaterial(id_per_material)
  for (var i = data_json_material.length - 1; i >= 0; i--) {
    if(data_json_material[i].id == id_per_material){
      id = i;
    }
  }
  temp = data_json_material[id - 1];
  data_json_material[id -1] = data_json_material[id];
  data_json_material[id] = temp;
  updateListEditableMaterials(id_edited_weekly_material);
}


function moveDownEditedMaterial(id_per_material){
  id = -1;
  prepareParamsDataJsonMaterial(id_per_material)
  for (var i = data_json_material.length - 1; i >= 0; i--) {
    if(data_json_material[i].id == id_per_material){
      id = i;
    }
  }
  temp = data_json_material[id + 1];
  data_json_material[id +1] = data_json_material[id];
  data_json_material[id] = temp;
  updateListEditableMaterials(id_edited_weekly_material);
}


function removeEditedMaterial(id_per_material){
  prepareParamsDataJsonMaterial(id_per_material)
  for (var i = data_json_material.length - 1; i >= 0; i--) {
    if(data_json_material[i].id == id_per_material){
      data_json_material.splice(i,1)
    }
  }
  updateListEditableMaterials(id_edited_weekly_material);
}



/*empty add new material template*/
function templateAddWeeklMaterial(source_id_atr, content_id, button_id_atr, data_json){
    // alert(content_id)
    if (genuine == null){
      isAddingNewWeeklyMaterial = true;
      button_id = button_id_atr;
      source_id = source_id_atr;
      // $('#needActionWeeklyMaterialEdit').attr('action',url_target);
      $('#'+button_id).attr('style', 'display :none');
      var newValue = "cancelEdit('"+source_id+"')";
      $('#cancelButtonId').attr('onclick', newValue);
      // document.getElementById('editableTextArea').innerHTML = document.getElementById(content_id).textContent;
      genuine = document.getElementById(source_id).innerHTML;
      data_json_material = [
            {is_announcement: true},
            {is_video:true},
            {is_file: true},
            {is_quiz: true}
          ]

      templateHTML = ''
      updateListEditableMaterials();
      document.getElementById(source_id).innerHTML =   document.getElementById('editableTemplateWeeklyMaterial').innerHTML
    }else{
      window.alert("You should finish your current editing before edit another one! ")
    }
  }

var id_edited_weekly_material = undefined;

function editWeeklyMaterial(source_id_atr, content_id, button_id_atr, material_id){
    // alert(content_id)
    if (genuine == null){
      button_id = button_id_atr;
      source_id = source_id_atr;
      id_edited_weekly_material = material_id;
      $('#'+button_id).attr('style', 'display :none');
      var newValue = "cancelEdit('"+source_id+"')";
      $('#cancelButtonId').attr('onclick', newValue);
      genuine = document.getElementById(source_id).innerHTML;
      data_json_material = detail_weekly_materials[material_id];
      templateHTML = '';
      templateHTML = document.getElementById('edit_week_'+material_id).innerHTML;
      is_id_edited_materials_changed = false;

      document.getElementById(source_id).innerHTML =  templateHTML;
    }else{
      window.alert("You should finish your current editing before edit another one! ")
    }
  }

  function addNewMaterial(id_weekly_material){
    new_material = '';
    if(id_weekly_material == undefined){
      new_material = $('#new_material_needed').val();
      prepareParamsDataJsonMaterial()
    }else{
      new_material = document.getElementById('new_material_needed_'+id_weekly_material).value;
      prepareParamsDataJsonMaterial(id_weekly_material)
    }
    if(new_material == 'Video'){
      data_json_material.push({ is_video:true, material_url:"https://www.youtube.com/embed/lZ3bPUKo5zc [sample]"});
    }else if( new_material == 'Quiz'){
      data_json_material.push({ is_quiz: true});
    }else if( new_material == 'PDF File'){
      data_json_material.push({ is_file: true, material_url:"http://infolab.stanford.edu/pub/papers/google.pdf [sample]"});
    }
    if(id_edited_weekly_material == undefined)
      updateListEditableMaterials();
    else
      updateListEditableMaterials(id_edited_weekly_material);
  }

  function updateListEditableMaterials(weekly_material_id){
    templateHTML = '';
      for (var i = 0; i < data_json_material.length ; i++) {
          templateHTML += getNeededMaterialTemplate(data_json_material[i], i);
      }
      if(weekly_material_id == undefined)
          document.getElementById('list_of_editable_material').innerHTML = templateHTML;
      else
          document.getElementById('edit_list_material_per_week_'+weekly_material_id).innerHTML = templateHTML;
  }
  // id_per_material = '585ea389ad2d82fc1f482fd9'
  // alert(document.getElementById(id_per_material +'_desc').value)


 /*Will save the current filled field*/
  function prepareParamsDataJsonMaterial(id_per_material){
    /*id per material is not using _id from mongoDB after updating views*/
    if(is_id_edited_materials_changed)
      id_per_material = undefined

    for (var i = 0; i < data_json_material.length; i++) {
      if(data_json_material[i].is_announcement){
        material_title = 'Announcement';
        material_url = '';
        // alert(id_per_material)
        if(id_per_material == undefined)
          material_description = document.getElementById(i +'_desc').value;
        else
          material_description = document.getElementById(data_json_material[i].id +'_desc').value;

      }else{
        if(id_per_material == undefined){
          material_title = document.getElementById(i +'_title').value;
          url= document.getElementById(i +'_url').value;
          if(data_json_material[i].is_video){
            base_url = 'https://www.youtube.com/embed/';
            index = url.indexOf("v=");
            if(index != -1)
              url = base_url+url.substr(index+2,11);
          }
          material_url = url;
          material_description =document.getElementById(i +'_desc').value;
        }else{
          material_title = document.getElementById(data_json_material[i].id +'_title').value;

          url= document.getElementById(data_json_material[i].id +'_url').value;
          if(data_json_material[i].is_video){
            base_url = 'https://www.youtube.com/embed/';
            index = url.indexOf("v=");
            if(index != -1)
              url = base_url+url.substr(index+2,11);
          }
          material_url = url;
          material_description =document.getElementById(data_json_material[i].id +'_desc').value;
        }

      }
      if(data_json_material[i].is_video){
        data_json_material[i] = setParamsMaterial(data_json_material[i].id, true, false, false, false, false, false, true, 
          material_title, material_description, material_url);
      }else if( data_json_material[i].is_announcement){
        data_json_material[i] = setParamsMaterial(data_json_material[i].id, false, true, false, false, false, false, false, 
          material_title, material_description, material_url);
      }else if( data_json_material[i].is_file){
        data_json_material[i] = setParamsMaterial(data_json_material[i].id, false, false, true, false, false, false, true, 
          material_title, material_description, material_url);
      }else if( data_json_material[i].is_quiz){
        data_json_material[i] = setParamsMaterial(data_json_material[i].id, false, false, false, true, false, false, true, 
          material_title, material_description, material_url);
      }
    }
  }

/*for editing weekly material*/
  function submitEditWeeklyMaterials(weekly_material_id){
   prepareParamsDataJsonMaterial(''+weekly_material_id);
    sendRequest(false, weekly_material_id);
  }

/*adding new weekly material*/
  function submitAddWeeklyMaterials(weekly_material_id){
    prepareParamsDataJsonMaterial();
    sendRequest(true, weekly_material_id);
  }


  function sendRequest(isNewMaterial, material_id){
    // alert("lolo")
    if(isNewMaterial){
       var http = new XMLHttpRequest();
      http.open("POST", "/course/material/addWeeklyMaterial", true);
      http.setRequestHeader("Content-type","application/json; charset=utf-8");
      var params = JSON.stringify(data_json_material);
      http.send((params));
      http.onload = function() {
        result = JSON.parse(http.responseText);
        if(http.responseText=="404" || result.status == 0){
          alert(http.responseText);
        }else{
          location.reload();
        }
      }
    }else{
       var http = new XMLHttpRequest();
      http.open("POST", "/course/material/editWeeklyMaterial", true);
      http.setRequestHeader("Content-type","application/json; charset=utf-8");

      var params = JSON.stringify({'data': data_json_material, 'id' : id_edited_weekly_material});
      http.send((params));
      http.onload = function() {
        result = JSON.parse(http.responseText);
        if(http.responseText=="404" || result.status == 0){
          alert(http.responseText);
        }else{
          location.reload();
        }
      }
      // alert("cdsjcns")
    }
  }


  function cancelEdit(){
    isAddingNewWeeklyMaterial = false;
    id_edited_weekly_material = undefined;
    templateHTML = '';
    document.getElementById(source_id).innerHTML = genuine  ;
    $('#'+button_id).attr('style', 'display :inline-block; margin-top: -7px; padding-right: 0px;');
    genuine = null;
  }
