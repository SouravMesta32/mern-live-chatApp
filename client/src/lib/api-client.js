import { HOST } from "@/utils/constants"
import axios from "axios"

export const apiclient = axios.create(
    {
        baseURL:HOST,
    }
)