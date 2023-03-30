import { NextApiResponse, NextApiRequest } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const prompt = `
      The following is an example of an expert JavaScript AI assistant helping to modify the Human's code review comment for other engineer to a very polite way.

      Human's comment: What is this shit?
      Modify comment by AI: Sorry, could you please clarify or provide more information regarding this matter?

      Human's comment: Like I said, the feature is not ready
      Modify comment by AI: As previously mentioned, the feature is not yet fully developed or prepared for use.

      Human's comment: I don't have time for this.
      Modify comment by AI: I apologize, but I currently have a very busy schedule. Is there a more convenient time we could discuss this?

      Human's comment: This is a waste of my time.
      Modify comment by AI: I appreciate the effort put into this, but I believe my time could be better utilized elsewhere. Could we revisit this at a later time?

      Human's comment: That's not my problem.
      Modify comment by AI: While I understand your concern, I believe this matter may be better addressed by someone else who is more closely involved. Would you like me to refer you to someone who may be able to assist you further?

      Human's comment: Why haven't you responded to my email yet?
      Modify comment by AI: I hope this message finds you well. I wanted to follow up on my recent email and kindly inquire if there may be any updates or information you could provide at this time.

      Human's comment: This is ridiculous.
      Modify comment by AI: While I understand your concerns, I believe it may be more productive to approach this matter from a different perspective. Could we discuss some alternative solutions?

      Human's comment: ${_req.body.prompt}
      Modify comment by AI:
    `
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 1,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      best_of: 3
    });

    return res.status(200).json(response.data.choices[0].text || "");
  } catch (error) {
    console.error(error);

    return res.status(error.response.status).json("Server Error Occured");
  }
}
