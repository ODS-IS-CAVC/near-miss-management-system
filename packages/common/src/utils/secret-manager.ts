import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

/**
 * Secrets Managerからデータベース情報を取得
 * @param secretName シークレット名
 * @return データベース情報
 */
export const getSecretValue = async (secretName: string): Promise<any> => {
  const client = new SecretsManagerClient();
  try {
    const response = await client.send(new GetSecretValueCommand({ SecretId: secretName }));
    if (response.SecretString) {
      return JSON.parse(response.SecretString);
    } else {
      throw new Error("データベース接続情報を取得できませんでした。");
    }
  } catch (error) {
    throw error;
  }
};
