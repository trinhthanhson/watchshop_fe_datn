import { initializeApp } from '@firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage' // Import necessary functions from Firebase Storage SDK

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCv2RnndYWjlpTg426hYhlayRbGkV00GQs',
  authDomain: 'watch-shop-3a14f.firebaseapp.com',
  projectId: 'watch-shop-3a14f',
  storageBucket: 'watch-shop-3a14f.appspot.com',
  messagingSenderId: '389878925104',
  appId: '1:389878925104:web:f68dcb87b404c236e32af5'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
function uint8ArrayToBlob(uint8Array, type) {
  return new Blob([uint8Array], { type: type });
}
export const uploadImageToFirebaseExcel = async (imageBuffer, imageExtension) => {
  const storage = getStorage(); // Khởi tạo Firebase Storage
  const imageName = `images/products/${Date.now()}.${imageExtension}`; // Tạo tên hình ảnh duy nhất

  // Tạo tham chiếu đến vị trí lưu hình ảnh
  const imageRef = ref(storage, imageName);

  // Chuyển đổi imageBuffer thành Blob để tải lên Firebase
  const blob = new Blob([imageBuffer], { type: `image/${imageExtension}` });

  try {
      // Tải hình ảnh lên Firebase
      await uploadBytes(imageRef, blob);
      // Lấy URL của hình ảnh đã tải lên
      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl; // Trả về URL hình ảnh
  } catch (error) {
      console.error("Error uploading image to Firebase:", error);
      throw error; // Ném lỗi lên trên để xử lý
  }
};
export const uploadImageToFirebase = async (file) => {
  console.log("Uploading file:", file); // Ghi log file để kiểm tra

  const storageRef = ref(storage, `images/products/${file.name}`);
  try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log("File uploaded successfully, URL:", url); // Ghi log URL
      return url;
  } catch (error) {
      console.error("Error uploading image:", error); // Ghi log lỗi
      throw error; // Ném lại lỗi để xử lý ở nơi gọi
  }
};