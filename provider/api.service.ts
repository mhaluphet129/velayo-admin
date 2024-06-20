import axios from "axios";
import Cookies from "js-cookie";

import { verify } from "@/assets/ts";
import { AuthStore } from "./context";
import { ExtendedResponse, ApiGetProps, ApiPostProps } from "@/types";

class API {
  public async get<T>({
    endpoint,
    query,
    publicRoute = false,
  }: ApiGetProps): Promise<ExtendedResponse<T>> {
    const { accessToken: token } = AuthStore.getState();

    if (!publicRoute) {
      await this.checkToken().catch((e) => {
        return {
          success: false,
          code: 401,
          message: e,
        };
      });
    }
    const request = await axios.get(`http://localhost:3000/api${endpoint}`, {
      params: query,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (request.data.success)
      return {
        success: true,
        code: request.status,
        message: request.data.message,
        data: request.data.data,
        meta: request.data.meta,
      };
    else
      return {
        success: false,
        code: 500,
        message: "There is an error in the Server.",
      };
  }

  public async post<T>({
    endpoint,
    payload,
    publicRoute = false,
  }: ApiPostProps): Promise<ExtendedResponse<T>> {
    const { accessToken: token } = AuthStore.getState();
    if (!publicRoute) {
      await this.checkToken().catch((e) => {
        return {
          success: false,
          code: 401,
          message: e,
        };
      });
    }

    const request = await axios.post(
      `http://localhost:3000/api${endpoint}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (request.data.success)
      return {
        success: true,
        code: request.status,
        message: request.data.message,
        data: request.data.data,
      };
    else
      return {
        ...request.data,
        success: false,
      };
  }

  private async checkToken() {
    const { accessToken: token } = AuthStore.getState();
    return new Promise<void>(async (resolve, reject) => {
      try {
        const flag = await verify(token!, process.env.JWT_PRIVATE_KEY!);
        if (!token || !flag) reject("No Bearer token");
        else resolve();
      } catch {
        Cookies.remove("token");
        reject("Incorrect/No Bearer token");
      }
    });
  }
}

export default API;
