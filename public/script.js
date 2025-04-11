//script.js

let page = 1;
let last = false;

function controlFunction(page1){
    //console.log("Paged changed to: ", page1);
    sort1 = $('#sort').val();
    filter1 = $('#filter').val();
    search1 = $('#search').val();
    const controls = {
        page: page1,
        sort: sort1, 
        filter: filter1, 
        search: search1
    };
    $.ajax({
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(controls),
        format: "json",
        url: "/arrange-task",
        beforeSend(){},
        success: function(data){
            if(data.err){
                console.err(data.err);
                return;
            }

            $('#task-container').empty();
            if(!data.res){
                let emptyMessage = `<div><p>No matching records were found.</p></div>`;
                $('#task-container').append(emptyMessage);
            }else{
                for(let i = 0; i < data.res.length; i++){
                    task = data.res[i];
                    last = data.last;
                    $('#task-container')
                        .append(compileTask(task.id, task.title, task.description, task.priority, task.completed));
                }
            }

            closeForms();
        },
        error: function(xhr){
            let errorMessage = `Error Code ${xhr.status}. `;
                if(xhr.responseJSON && xhr.responseJSON.err){
                    errorMessage += xhr.responseJSON.err;
                }else if(xhr.responseText){
                    errorMessage += xhr.responseText;
                }
            console.error(errorMessage);
        }
    });
}

function openAddForm(){
    $("#add-form").removeClass("hide");
    $("#edit-form").addClass("hide");
}

function openEditForm(button){
    $("#add-form").addClass("hide");
    $("#edit-form").removeClass("hide");

    const taskId = $(button).data('task-id');               //struggled to access the tasks in javascript
    const taskTitle = $(button).data('title');
    const taskDescription = $(button).data('description');
    const taskPriority = $(button).data('priority');
    $("#edit-task-id").val(taskId);
    $("#edit-title").val(taskTitle);
    $("#edit-description").val(taskDescription);
    $("#edit-priority option").each( function(index){
        if(taskPriority == index + 1){
            $(this).prop("selected", true);
        }else{
            $(this).prop("selected", false);
        }
    });
}

function closeForms(){
    $("#add-form").addClass("hide");
    $("#edit-form").addClass("hide");
    $("form input:not(#search)").each( function(){
        $(this).val("");
    });
}

function compileTask(id, title, description, priority, completed){
    let strikeTest = "";
    if(completed){
        strikeTest = "strike";
    }
    let newTask = `
        <div id="task-row-${id}" class="task-info ${strikeTest}">
            <p>${id}</p>
            <p>${title}</p>
            <p>${description}</p>`
            
    if(priority == 1){
        newTask += '<p>High</p>';
    }else if(priority == 2){
        newTask += '<p>Medium</p>';
    }else{
        newTask += '<p>Low</p>';
    }

    if(completed){
        newTask += '<p class="compen">Completed</p>';
    }else{
        newTask += '<p class="compen">Pending</p>'
    }

    newTask += `
            <form class="tr toggle-form" data-task-id="${id}">
                <button class="icon-link" type="submit"><span class="material-icons" style="color: #28a745;">check_circle</span></button>
            </form>
            <div class="tr">
                <button data-task-id="${id}" data-title="${title}" data-description="${description}" data-priority="${priority}" class="icon-link" type="button" onclick="openEditForm(this)"><span class="material-icons" style="color: #ecd609;;">edit</span></button>
            </div>
            <form class="tr delete-form" data-task-id="${id}">
                <button class="icon-link" type="submit"><span class="material-icons" style="color: #ee0909;">delete</span></button>
            </form>
        </div>`

    return newTask;
}

$(document).ready(function(){
    controlFunction(page);
    $('#response-message').html("").removeClass('success').removeClass('error');

    $('#next').click( function(){
        if(!last){
            controlFunction(page += 1);
        }
    });

    $('#previous').click( function(){
        if(page > 1){
            controlFunction(page -= 1);
        }
    });

    $('#add-form').submit( function (e){
        e.preventDefault();
        const formData = {
            title: $('#add-title').val(),
            description: $('#add-description').val(),
            priority: $('#add-priority').val()
        };
        $.ajax({
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            url: '/add-task',
            data: JSON.stringify(formData),
            dataType: "json",
            beforeSend(){},
            success: function(data){
                if(data.err){
                    $('#response-message').html(data.err).addClass('error').removeClass('success');
                    return;
                }
                $('#response-message').html(`Added Task ${data.res.title}`).addClass('success').removeClass('error');
                let newTask = compileTask(data.res.id, data.res.title, data.res.description, data.res.priority, data.res.completed);
                $(`#task-container`).append(newTask);
                controlFunction();
            },
            error: function(xhr){
                let errorMessage = `Error Code ${xhr.status}. `;
                if(xhr.responseJSON && xhr.responseJSON.err){
                    errorMessage += xhr.responseJSON.err;
                }else if(xhr.responseText){
                    errorMessage += xhr.responseText;
                }
                $('#response-message').html(errorMessage).addClass('error').removeClass('success');
            }
        });
    });

    $(document).on('submit', '.edit-form', function (e){
        e.preventDefault();
        const taskId = $('#edit-task-id').val();
        const url = `/edit-task/${taskId}`;
        const formData = {
            id: taskId,
            title: $('#edit-title').val(),
            description: $('#edit-description').val(),
            priority: $('#edit-priority').val()
        };
        $.ajax({
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            url: url,
            data: JSON.stringify(formData),
            dataType: "json",
            beforeSend(){},
            success: function(data){
                if(data.err){
                    $('#response-message').html(data.err).addClass('error').removeClass('success');
                    return;
                }
                $('#response-message').html(`Edited Task ${data.res.title}`).addClass('success').removeClass('error');
                let newTask = compileTask(data.res.id, data.res.title, data.res.description, data.res.priority, data.res.completed);
                $(`#task-row-${taskId}`).replaceWith(newTask);
                controlFunction();
            },
            error: function(xhr){
                let errorMessage = `Error Code ${xhr.status}. `;
                if(xhr.responseJSON && xhr.responseJSON.err){
                    errorMessage += xhr.responseJSON.err;
                }else if(xhr.responseText){
                    errorMessage += xhr.responseText;
                }
                $('#response-message').html(errorMessage).addClass('error').removeClass('success');
            }
        });
    });

    $(document).on('submit', '.delete-form', function (e){
        e.preventDefault();
        const taskId = $(this).data('task-id');
        const url = `/delete-task/${taskId}`;
        $.ajax({
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            url: url,
            data: JSON.stringify({ id: taskId }),
            dataType: "json",
            beforeSend(){},
            success: function(data){
                if(data.err){
                    $('#response-message').html(data.err).addClass('error').removeClass('success');
                    return;
                }
                $('#response-message').html(`Deleted Task ${data.res.title}`).addClass('success').removeClass('error');
                $(`#task-row-${taskId}`).remove();
                controlFunction();
            },
            error: function(xhr){
                let errorMessage = `Error Code ${xhr.status}. `;
                if(xhr.responseJSON && xhr.responseJSON.err){
                    errorMessage += xhr.responseJSON.err;
                }else if(xhr.responseText){
                    errorMessage += xhr.responseText;
                }
                $('#response-message').html(errorMessage).addClass('error').removeClass('success');
            }
        });
    });

    $(document).on('submit', '.toggle-form', function (e){
        e.preventDefault();
        const taskId = $(this).data('task-id');
        const url = `/toggle-task/${taskId}`;
        $.ajax({
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            dataType: "json",
            url: url,
            beforeSend(){},
            success: function(data){
                if(data.err){
                    $('#response-message').html(data.err).addClass('error').removeClass('success');
                    return;
                }

                $('#response-message').html(`Updated task ${data.res.title}`).addClass('success').removeClass('error');
                let status = "Completed";
                if(data.res.completed != true){
                    status = "Pending";
                }
                $(`#task-row-${taskId}`).toggleClass('strike').find('.compen').text(status);
                controlFunction();
            },
            error: function(xhr) {
                let errorMessage = `Error Code ${xhr.status}. `;
                if(xhr.responseJSON && xhr.responseJSON.err){
                    errorMessage += xhr.responseJSON.err;
                }else if(xhr.responseText){
                    errorMessage += xhr.responseText;
                }
                $('#response-message').html(errorMessage).addClass('error').removeClass('success');
            }
        });
    });
});