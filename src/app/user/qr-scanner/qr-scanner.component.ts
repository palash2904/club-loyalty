import { Component, ElementRef, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BarcodeFormat, BrowserQRCodeReader, Result } from '@zxing/library';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent {

  @ViewChild('video', { static: true }) videoElement!: ElementRef;
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef;

  private codeReader: BrowserQRCodeReader;
  private video!: HTMLVideoElement;
  private canvas!: HTMLCanvasElement;
  private captureStream!: MediaStream;

  constructor(private service: UserService, private toastr: ToastrService) {
    this.codeReader = new BrowserQRCodeReader();
  }

  ngOnInit(): void {
    this.video = this.videoElement.nativeElement;
    this.canvas = this.canvasElement.nativeElement;
    this.startScanner();
  }

  private async startScanner() {
    try {
      this.captureStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      this.video.srcObject = this.captureStream;
      await this.video.play();
      this.scanCode();
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      this.toastr.error('Error accessing camera: ' + err.message);
    }
  }

  private scanCode() {
    this.codeReader.decodeFromVideoDevice(null, this.video, (result: Result | null) => {
      if (result) {
        this.toastr.success('QR code detected: ' + result.getText());
        this.callApi(result.getText());
      } else {
        setTimeout(() => this.scanCode(), 1000); // Retry scanning after 1 second
      }
    });
  }

  private callApi(qrData: string) {
    this.service.getApi1(qrData).subscribe({
      next: (resp) => {
        this.toastr.success(resp.message);
        alert('Result: ' + resp.status);
      },
      error: (err) => {
        this.toastr.error(err.error);
        alert('Error: ' + err.error);
      }
    });
    this.stopScanner();
  }

  private stopScanner() {
    if (this.captureStream) {
      this.captureStream.getTracks().forEach(track => track.stop());
    }
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }
    
  // formats = [BarcodeFormat.QR_CODE];
  // isScannerVisible = false;

  // @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;

  // openScanner() {
  //   this.isScannerVisible = true;
  // }

  // handleQrCodeResult(result: string) {
  //   console.log('QR Code Result:', result);
  //   this.isScannerVisible = false;
  //   // Add your logic to handle the scanned QR code result
  // }

}
