export default function AssistantChatMessageProducts({messageConversation}) {
    const {type, dataRequest} = messageConversation.message;


    if (type && type === 'products' && dataRequest) {
        return (
            <div>
                <div class="space-y-6 mt-10">

                    {dataRequest && dataRequest.map((product, index) => (
                        <div
                            class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                            <div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                                <a href="#" class="shrink-0 md:order-1">
                                    <img class="h-20 w-20 dark:hidden"
                                         src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg"
                                         alt="imac image"/>
                                    <img class="hidden h-20 w-20 dark:block"
                                         src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-dark.svg"
                                         alt="imac image"/>
                                </a>
                                <div class="flex items-center justify-between md:order-3 md:justify-end">
                                    <div class="text-end md:order-4 md:w-32">
                                        <p className="text-base font-bold text-gray-900 dark:text-white">{product.price_net} zł netto</p>
                                        <p className="text-base font-bold text-gray-400 dark:text-white">{product.price_gross} zł brutto</p>
                                    </div>
                                </div>

                                <div class="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                                    <a href="#"
                                       class="text-base font-medium text-gray-900 hover:underline dark:text-white">{product.name}</a>
                                </div>
                            </div>
                        </div>
                    ))}


                </div>

            </div>
        );

    }
}
