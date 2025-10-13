import * as multer from 'multer';
import * as fs from 'fs';

/**
 * 配置 multer 的存储引擎（diskStorage）
 * 该配置决定文件上传时保存到哪里、文件名如何命名
 */
const storage = multer.diskStorage({
  /**
   * destination：定义文件存储的目标文件夹
   * @param req 当前请求对象
   * @param file 当前上传的文件对象
   * @param cb 回调函数，cb(error, path)
   */
  destination: function (req, file, cb) {
    try {
      // 尝试创建 uploads 文件夹（如果不存在）
      // mkdirSync 如果目录已存在会抛出异常，这里用 try...catch 忽略错误
      fs.mkdirSync('uploads');
    } catch (e) {
      // 忽略目录已存在的错误
      console.log(e);
    }

    // 告诉 multer 文件要存放在 'uploads' 文件夹中
    cb(null, 'uploads');
  },

  /**
   * filename：定义上传文件在服务器中的文件名
   * @param req 当前请求对象
   * @param file 当前上传的文件对象
   * @param cb 回调函数，cb(error, filename)
   */
  filename: function (req, file, cb) {
    // 创建一个唯一文件名后缀：时间戳 + 随机数 + 原文件名
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '-' +
      file.originalname;

    // 将生成的文件名传给回调函数
    cb(null, uniqueSuffix);
  },
});

export { storage };
