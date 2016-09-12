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
                if (isFileValid(file)) {
                    formData.append('uploads[]', file, file.name);
                } else {
                    alert("Image is not suitable for this resource");
                }
            }

            $.ajax({
                url: '/post/uploads',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                withCredentials: true,
                success: function (data) {
                    formData.getAll('uploads[]').forEach(function (img) {
                        var el = $("iframe").contents().find("body#tinymce");
                        addImgToPost(img.name, el);
                    });
                },
                error: function (err) {
                    console.log("can't upload file " + err);
                }
            });
        }
    });
};

function addImgToPost(imgName, container) {
    var imgContainer = "<div class='uploadedImg'><img src='" + "/uploads/" + imgName + "' alt=" + imgName + "/></div>";
    container.append(imgContainer);
}
function isFileValid(file) {
    console.log(file.size);
    return file.name.match(/.+\.(jpg|png)$/i) && file.size <= 2000000;
}