const formatBase64ToBuffer = async (base64) => {
//   return await Buffer.from(base64, "base64");
// };
if (!base64) {
  throw new Error("Base64 data is missing or undefined");
}
return Buffer.from(base64, "base64");
};

module.exports = { formatBase64ToBuffer };