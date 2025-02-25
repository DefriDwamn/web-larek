export interface Settings {
	gallerySelector: string;
	gallerySettings: {
		itemClass: string;
	};

    cardCatalogTemplate: string;
    cardPreviewTemplate: string;
    cardBasketTemplate: string;
    cardSettings: {
        id: string;
        image: string;
	    title: string;
        category: string;
        description: string;
        price: string;
        delete: string;
		toBasket: string;
	    compactClass: string;
        expendedClass: string;
    };

	cardCategory: {
		soft: string;
		other: string;
		hard: string;
		button: string;
		additional: string;
	}

	mainSelector: string;
	mainSettings: {
		wrapper: string;
	    counter: string;
	    basket: string;
	    lockedClass: string; 
	};

	basketTemplate: string;
	basketSettings: {
        itemsList: string;
		itemClass: string;
        totalLabel: string;
	};

    formSettings: {
		order_name: string;
		contacts_name: string;
        error: string;
        submit_order: string;
		submit_contacts: string;
    };

	orderInfoTemplate: string;
	orderInfoSettings: {
        isCash: string;
        isCard: string;
		address: string;
		button_active: string;
		button_unactive: string;
	};

    contactsTemplate: string;
	contactsSettings: {
		email: string;
		phone: string;
	};

    successTemplate: string;
    successSettings: {
        total: string;
    }

	modalTemplate: string;
	modalSettings: {
		close: string;
		content: string;
        activeClass: string;
	};
	cardModal: {
        button: string;
	};
	basketModal: {
		button: string;
	};
	successModal: {
		button: string;
	};
}