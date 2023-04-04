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
	},
};

async function getProducts() {
	const response = await fetch(url, options);
	const data = await response.json();
	return data as Product[];
}

async function getProduct(id: number) {
	const response = await fetch(`${url}/${id}`, options);
	const data = await response.json();
	return data as Product | null;
}

export async function generateStaticParams() {
	const products = (await getProducts()) as Product[];

	if (!products) {
		return [];
	}

	return products.map((product: any) => ({
		productSlug: product.slug ?? "",
	}));
}

export default async function Page({ params }: { params: { id: number } }) {
	const product = await getProduct(params.id);

	return (
		<main>
			<Link href='/'> ← Back to home</Link>
			{product ? (
				<>
					<h1>
						{product.name}
						{product.images && product.images.length > 0 && (
							<Image
								src={product.images?.[0]?.src}
								alt={product.name}
								width={50}
								height={50}
							/>
						)}
					</h1>
					<h2>{product.id}</h2>
				</>
			) : (
				<h1>Product not found</h1>
			)}
		</main>
	);
}
