import { Link } from 'react-router-dom'
import AddToCartButton from './AddToCartButton'
import type {Watch} from "../types/watch.ts";

export default function ProductCard({ watch }: { watch: Watch }) {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
            <Link
                to={`/watches/${watch.id}`}
                className="block relative h-48 overflow-hidden"
            >
                <img
                    src={watch.image}
                    alt={watch.name}
                    className="w-full h-full object-contain p-4"
                    loading="lazy"
                />
            </Link>

            <div className="p-4 flex flex-col flex-1">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                        <Link
                            to={`/watches/${watch.id}`}
                            className="hover:text-blue-600 transition-colors"
                        >
                            {watch.name}
                        </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                        {watch.brand.name}
                    </p>
                </div>

                <div className="mt-4">
                    <div className="flex justify-between items-center">
            <span className="text-xl font-bold">
              {parseFloat(watch.price).toLocaleString('ru-RU')} ₽
            </span>
                        <AddToCartButton watchId={watch.id} />
                    </div>
                </div>
            </div>
        </div>
    )
}