$(document).ready(function () {
    $("#edit-number").on("click", function () {
        $("#phoneNumber").css("display", "block");
        $("#phoneNumber").focus();
    });

    $("#phoneNumberList").change(function () {
        $("#phoneNumber").val($(this).val());
        $("#phoneNumber").css("display", "block");
        $("#phoneNumberList option").each(function () {
            $(this).attr("selected", false);
        });
    });
});
