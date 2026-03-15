export interface LoginResponse {
  idResult: string;
  message: string;
  data: {
    otpCodeID: number;
    userID: number;
    code: string;
    expiryTime: Date;
    isUsed: boolean;
  };
}
