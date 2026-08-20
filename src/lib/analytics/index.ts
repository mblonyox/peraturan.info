import { env } from "cloudflare:workers";

interface GraphQLResponse {
  data: {
    viewer: {
      zones: {
        httpRequestsAdaptiveGroups: {
          count: number;
          dimensions: { clientRequestPath: string };
        }[];
      }[];
    };
  };
}

export async function getTopVisitedPaths() {
  const now = Date.now();
  const today = new Date(now);
  const yesterday = new Date(now - 86_400_000);
  const query = /* GraphQL */ `
    query TopVisitedPaths($zoneTag: string!, $start: Time!, $end: Time!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          httpRequestsAdaptiveGroups(
            filter: {
              datetime_geq: $start
              datetime_lt: $end
              requestSource: "eyeball"
              OR: [
                { clientRequestPath_like: "/uu/%/%/%" }
                { clientRequestPath_like: "/perpu/%/%/%" }
                { clientRequestPath_like: "/pp/%/%/%" }
                { clientRequestPath_like: "/perpres/%/%/%" }
                { clientRequestPath_like: "/permenkeu/%/%/%" }
              ]
            }
            limit: 100
            orderBy: [count_DESC]
          ) {
            count
            dimensions {
              clientRequestPath
            }
          }
        }
      }
    }
  `;
  const variables = {
    zoneTag: env.CF_ANALYTICS_ZONE_ID,
    start: yesterday.toISOString(),
    end: today.toISOString(),
  };
  const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.CF_ANALYTICS_API_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json<GraphQLResponse>();
  const group = json.data.viewer.zones[0].httpRequestsAdaptiveGroups;
  const pathCountMap = group
    .map((i) => ({
      path: i.dimensions.clientRequestPath.split("/").slice(1, 4).join("/"),
      count: i.count,
    }))
    .reduce(
      (arr, c) => {
        arr[c.path] ??= 0;
        arr[c.path] += c.count;
        return arr;
      },
      {} as Record<string, number>,
    );
  return pathCountMap;
}
