var inputImage = function (element) {

    element.on('change', function (e) {
        var files = e.target.files;

        if (files.length) {
            // create a FormData object which will be sent as the data payload in the
            // AJAX request
            var formData = new FormData();

            // loop through all the selected files and add them to the formData object
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                // add the files to formData object for the data payload
                formData.append('uploads[]', file, file.name);
            }

            $.ajax({
                url: '/post/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function () {
                    formData.getAll('uploads[]').forEach(function(img){
                        addImgToPost(img.name, $("textarea#body"));
                    })
                },
                error: function () {
                    console.log("can't upload file");
                }
            });
        }

    });

};

function addImgToPost(imgName, container){
    var imgContainer = "<div class='uploadedImg'><img src='"
        + "/uploads/"
        + imgName
        + "' alt="
        + imgName
        + "/></div>";

    container.val(container.val() + imgContainer);
}













