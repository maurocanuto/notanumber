import * as fs from 'fs'
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const URL_EXPIRE_SECONDS = 60 * 5

const getPresignedUrl = async (client: S3Client, bucket: string, key: string) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  return await getSignedUrl(client, command, { expiresIn: URL_EXPIRE_SECONDS })
}
export const saveToS3 = async ({
  client,
  bucket,
  key,
  fileLocalPath
}: {
  client: S3Client
  bucket: string
  key: string
  fileLocalPath: string
}): Promise<string> => {
  const data = fs.readFileSync(fileLocalPath)
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: data
  })
  const response = await client.send(command)
  return await getPresignedUrl(client, bucket, key)
}
