import { PageProps } from "$fresh/server.ts";
import ListPeraturan, {
  ListPeraturanProps,
} from "../../components/list_peraturan.tsx";

export { handler } from "../../handlers/list_peraturan.ts";

export default function PeraturanByBentuk({
  data,
}: PageProps<ListPeraturanProps>) {
  return <ListPeraturan {...data} />;
}
