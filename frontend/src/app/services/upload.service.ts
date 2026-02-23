import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private cloudName = 'dbm3r9ke3';
    private uploadPreset = 'unsigned_preset';
    private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    constructor(private http: HttpClient) { }

    uploadImage(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.uploadPreset);
        return this.http.post(this.uploadUrl, formData);
    }
}