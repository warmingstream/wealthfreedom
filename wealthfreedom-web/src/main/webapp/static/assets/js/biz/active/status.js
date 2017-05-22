/**
 * Created by changjiang3 on 2016/4/15.
 */

//暂停活动
function pauseActive(param){
    updateStatus(param, "pause");
}

//恢复活动
function resumeActive(param){
    updateStatus(param, "resume");
}

//停止活动
function stopActive(param, activeName){
    var content = "请确认是否停止“" + activeName + "”活动，请注意活动一旦停止将无法恢复，与活动相关的所有任务也将无法继续进行，请需确认是否继续！";
    popupTool.confirm({
        title : "重要提醒",
        content : content,
        onConfirm :  function(){
            updateStatus(param, "stop");
        }
    });
    //if(!confirm(content)){
    //    return;
    //}
    //updateStatus(param, "stop");
}

function updateStatus(param, urlPart){
    $(".param-" + module + "-status").val(param);
    _ajaxPost(urlPart, "param-" + module + "-status", false, refreshStatus);
}

function refreshStatus(param){
    var id = param.split("_")[0];
    var par = param.split(",")[0];
    var status = param.split(",")[1];
    var html_status;
    var html_state;
    if(1 == status){
        html_status = '<button class="btn btn-dark-yellow btn-xs" title="暂停" onclick="pauseActive(&quot;' + par + '&quot;)">暂停</button> ';
        html_status += '<button class="btn btn-dark-red btn-xs" title="停止" onclick="stopActive(&quot;' + par + '&quot;)">停止</button>';
        html_state = '<span class="label label-success">进行中</span>';
    }else if(2 == status){
        html_status = '<button class="btn btn-dark-green btn-xs" title="开始" onclick="resumeActive(&quot;' + par + '&quot;)">开始</button> ';
        html_status += '<button class="btn btn-dark-red btn-xs" title="停止" onclick="stopActive(&quot;' + par + '&quot;)">停止</button>';
        html_state = '<span class="label label-warning">已暂停</span>';
    }else if(3 == status){
        html_status = '<button class="btn btn-dark-grey btn-xs" title="开始" disabled>开始</button> ';
        html_status += '<button class="btn btn-dark-grey btn-xs" title="停止" disabled>停止</button>';
        html_state = '<span class="label label-danger">已停止</span>';
    }
    if(html_status){
        $("#status_" + id).html(html_status);
        $("#state_" + id).html(html_state);
        $("#check_" + id).val(par);
    }
}

