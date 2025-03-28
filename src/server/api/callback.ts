import { LoaderFunctionArgs, redirect } from "react-router";
import { getGoogleIDFromCallback, stateSchema } from "../oauth";
import { gidCookie, stateCookie } from "../cookies";
import { z } from "zod";

const searchParamsSchema = z.object({
  code: z.string(),
  stateString: z.string(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const { code, stateString } = searchParamsSchema.parse({
    code: searchParams.get("code"),
    stateString: searchParams.get("state"),
  });
  const providedState = stateSchema.parse(JSON.parse(stateString));
  const expectedState = await stateCookie(providedState.key).parse(request);

  const googleID = await getGoogleIDFromCallback({
    providedState: providedState.value,
    expectedState,
    code,
  });

  return redirect("/", {
    headers: [["Set-Cookie", await gidCookie.serialize(googleID)]],
  });
}
