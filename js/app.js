$(document).ready(function() {

    function loadTable() {
        $.ajax({
            url: "http://localhost:8000/api-read.php",
            success: function(data) {
                table(data);

            }
        });
    };

    function jsonData(targetForm) {
        var arr = $(targetForm).serializeArray();

        var obj = {};
        for (var a = 0; a < arr.length; a++) {
            if (arr[a].value == "") {
                return false;
            }
            obj[arr[a].name] = arr[a].value;
        }

        var json_string = JSON.stringify(obj);

        return json_string;

    }

    function message(message, status) {
        if (status == true) {
            $("#success-message").html(message).slideDown();
            $("#error-message").slideUp();
            setTimeout(function() {
                $("#success-message").slideUp();
            }, 4000);

        } else if (status == false) {
            $("#error-message").html(message).slideDown();
            $("#success-message").slideUp();
            setTimeout(function() {
                $("#error-message").slideUp();
            }, 4000);
        }
    }

    function table(table) {
        if (table.status == false) {
            $("#load-table").append("<tr><td colspan='6'><h2>" + data.message + "</h2></td></tr>");
        } else {
            $.each(table, function(key, value) {
                $("#load-table").append("<tr>" +
                    "<td>" + value.id + "</td>" +
                    "<td>" + value.name + "</td>" +
                    "<td>" + value.age + "</td>" +
                    "<td>" + value.city + "</td>" +
                    "<td><button class='edit-btn' data-eid='" + value.id + "'>Edit</button></td>" +
                    "<td><button class='delete-btn' data-id='" + value.id + "'>Delete</button></td>" +
                    "</tr>");
            });
        }
    }

    loadTable();

    $("#save-button").on("click", function(e) {
        e.preventDefault();
        var sname = $("#sname").val();
        var sage = $("#sage").val();
        var scity = $("#scity").val();
        if (sname == "" || sage == "" || scity == "") {
            $("#error-message").html("All fields are required").slideDown();
            $("#success-message").slideUp();
        } else {
            var jsonObj = jsonData("#addForm");
            console.log(jsonData);
            $.ajax({
                url: "http://localhost:8000/api-insert.php",
                type: "POST",
                data: jsonObj,
                success: function(data) {
                    message(data.message, data.status);
                    if (data.status == true) {
                        loadTable();
                        $("#addForm").trigger("reset");
                    }
                }
            });
        }

    });
    $(document).on("click", ".delete-btn", function() {
        if (confirm("Do you really want to delete this record ?")) {
            var studentId = $(this).data("did");
            console.log(studentId);
            var obj = { sid: studentId };
            var myJSON = JSON.stringify(obj);
            var row = this;
            $.ajax({
                url: "http://localhost:8000/api-delete.php",
                type: "POST",
                data: myJSON,
                success: function(data) {
                    console.log(data);
                    message(data.message, data.status);
                    if (data.status == true) {
                        $(row).closest("tr").fadeOut();
                    }
                }
            });
        }

    });
    $(document).on("click", ".edit-btn", function() {
        $("#modal").show();
        var studentId = $(this).data("eid");
        var obj = { sid: studentId };
        var myJSON = JSON.stringify(obj);

        $.ajax({
            url: "http://localhost:8000/api-update.php",
            data: myJSON,
            type: "POST",
            success: function(data) {
                $("#edit-id").val(data[0].id);
                $("#edit-name").val(data[0].name);
                $("#edit-age").val(data[0].age);
                $("#edit-city").val(data[0].city);
            }
        });

    });
    $("#close-btn").on("click", function() {
        $("#modal").hide();
    })
    $(document).on("click", "#edit-submit", function() {
        var n = $("#edit-name").val();
        var a = $("#edit-age").val();
        var c = $("#edit-city").val();
        if (n == "" || a == "" || c == "") {
            $("#error-message").html("All fields are required").slideDown();
            $("#success-message").slideUp();
        } else {
            var jsonObj = jsonData("#edit-form");
            $.ajax({
                url: "http://localhost:8000/api-update-data.php",
                type: "POST",
                data: jsonObj,
                success: function(data) {
                    if (data.status == true) {
                        loadTable();
                        $("#modal").hide();

                    };
                    message(data.message, data.status);

                }
            });
        }
    });
    $("#search").on("keyup", function() {
        var search_term = $(this).val();
        if (search_term == "") {
            $("#addForm").show();
            loadTable();
        } else {
            var obj = { search: search_term };
            var myJSON = JSON.stringify(obj);
            $("#load-table").html("");

            $.ajax({
                url: "http://localhost:8000/api-search.php",
                type: "POST",
                data: myJSON,
                success: function(data) {
                    $("#addForm").hide();
                    table(data);
                }
            });
        }

    });
});