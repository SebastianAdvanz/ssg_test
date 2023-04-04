import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

const consumerKey = "ck_2b7988b3f4e1934dbba9b0e25aeec3de9c2f297c";
const consumerSecret = "cs_4b35e2e31fd05ed966f3b018e406c25ef2f25f8f";

const root = "https://internaltest0.advanz.no";
const API_route = "/wp-json/wc/v3";
const productsRoute = "/products";
const url = `${root}${API_route}${productsRoute}`;

const options = {
  next: { revalidate: 60 },
	method: "GET",
	headers: {
		Authorization: `Basic ${Buffer.from(
			`${consumerKey}:${consumerSecret}`
		).toString("base64")}`,
	}
};

async function getProducts() {
	const response = await fetch(url, options);
	const data = await response.json();
	return data as Product[];
}

export default async function Home() {
	const products = await getProducts();

	return (
		<main>
			{products.map((product) => {
				return (
					<div key={product.id}>
						<Link href={`/products/${product.id}`}>
							<h1>
								{product.name}
								<Image
									src={product.images[0].src}
									alt={product.name}
									width={50}
									height={50}
								/>
							</h1>
							<h2>{product.id}</h2>
						</Link>
					</div>
				);
			})}
		</main>
	);
}
