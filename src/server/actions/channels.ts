import { insertChannel, joinUserToChannel } from "../repository/channels";
import { User } from "../database/schema";
import { z } from "zod";
import { DEFAULT_ID_SIZE } from "../repository/utils";

export async function createChannelAction(user: User, formData: FormData) {
  const rawName = formData.get("name");
  const {
    data: name,
    success: nameValid,
    error: nameError,
  } = z
    .string({ message: "Please provide a channel name" })
    .min(3, "Channel names must be at least 3 characters")
    .max(16, "Channel names can be at most 16 characters")
    .regex(
      /^([A-z]|\ |[0-9])+$/g,
      "Channel names can only contain letters, numbers, and spaces"
    )
    .safeParse(rawName);
  if (!nameValid) return nameError.format()._errors;
  const success = await insertChannel({
    ownerId: user.id,
    name,
  });
  if (!success) return ["You already have 3 channels"];
}

export async function joinChannelAction(user: User, formData: FormData) {
  const channelId = z.string().max(DEFAULT_ID_SIZE).parse(formData.get("id"));
  const success = await joinUserToChannel(user.id, channelId);
  if (!success) return ["Channel does not exist, or you're already in it"];
}
