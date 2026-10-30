import CryptoJS from "crypto-js";
interface EncryptionProps {
  plainText: string;
  key?: string;
}
interface DecryptionProps {
  cipherText: string;
  key?: string;
}
export const encryption = ({
  plainText,
  key = process.env.AES_SECRET_KEY,
}: EncryptionProps) => {
  return CryptoJS.AES.encrypt(plainText, key as string).toString();
};

export const decryption = ({
  cipherText,
  key = process.env.AES_SECRET_KEY,
}: DecryptionProps) => {
  return CryptoJS.AES.decrypt(cipherText, key as string).toString(
    CryptoJS.enc.Utf8,
  );
};
