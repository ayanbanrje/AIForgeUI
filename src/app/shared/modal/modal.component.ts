import { Component, Input, OnChanges, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { environment } from "src/environments/environment";
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import awsmobile from '../../../aws-exports';
declare const document: any;
@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})

export class ModalComponent implements OnChanges {
    @Input() header = '';
    @Input() view = false;
    @Input() width;
    @Input() styles = {'width': '75%'};
    @Input() headerColor;
    @Output() viewChange = new EventEmitter();
    @Input() changePassword = false;
    @Input() installationDevice = false;
    aboutS3FileBucket = environment.ABOUT_S3_FILE_BUCKET;
    releaseNotesS3FileName = environment.RELEASE_NOTES_S3_FILE_NAME;
    userManualS3FileName = environment.USER_MANUAL_S3_FILE_NAME;
    region = environment.REGION;
    awsconfig = awsmobile;
    @Input() zIndex = '9999';
    @Input() isMobileView= false;

    bucket = AWS.config.update(
        {
            accessKeyId: this.awsconfig.accessKey,
            secretAccessKey: this.awsconfig.secretKey,
            region: 'ap-south-1',
        }
    );

    params = {
        Bucket: this.aboutS3FileBucket,
        Key: this.releaseNotesS3FileName,
        Expires: 300 // URL will expire in 5 minutes
    };

    pdfUrl = '';
    // s3 = new S3.getSignedUrl('getObject', this.params, (err, url) => {
    //     if (err) console.log(err);
    //     else {
    //         this.pdfUrl = url;
    //     }
    // });


    releaseNoteFileLink = "https://" + this.aboutS3FileBucket + ".s3." + this.region + ".amazonaws.com/" + this.releaseNotesS3FileName;
    userManualFileLink = "https://" + this.aboutS3FileBucket + ".s3." + this.region + ".amazonaws.com/" + this.userManualS3FileName;

    constructor(private cd: ChangeDetectorRef) {
        //console.log(this.s3)
    }
    ngOnChanges() {
        // document.querySelector('html').style.overflow = this.view ? 'hidden' : '';
    }
    public close() {
        // document.querySelector('html').style.overflow = '';
        this.view = false;
        this.viewChange.emit(false);
        this.cd.markForCheck();
    }

}
