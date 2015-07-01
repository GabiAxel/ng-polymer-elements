# cors-upload-sample

Sample code for uploading files directly with vanilla Javascript (XHR/CORS). Try the [live version](http://googledrive.github.io/cors-upload-sample)
and drag & drop files to upload them to Google Drive.

This sample has only been tested with Chrome. Other browsers may or may not work.

## Usage

If you'd like to use the code in your own project, copy `upload.js` and include it.

    <script src="/path/to/upload.js"></script>
    
When uploading a file, create a new MediaUploader initialized with a Blob or File and access token. Then call `upload()` to start the upload process.

    var uploader = new MediaUploader({
      file: content,
      token: accessToken,
    });
    uploader.upload();

Your access token need to be authorized for any of the Drive scopes that permit writes (drive, drive.file, or drive.appdata.) You can go through [one of the OAuth 2.0 flows](https://developers.google.com/accounts/docs/OAuth2) to retrieve one or use [Google+ Sign-In](https://developers.google.com/+/web/signin/) button.

See `upload.js` for additional parameters you can include when initializing the uploader, including callbacks for success & failure events.
