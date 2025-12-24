const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
	try {
		const {name,description} = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch(error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
		const allCategorys = await Category.find(
			{},
			{ name: true, description: true }
		);
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
            //get categoryId
            const {categoryId} = req.body;
            //get courses for specified categoryId
            const selectedCategory = await Category.findById(categoryId)
                                            .populate("courses")
                                            .exec();
            //validation
            if(!selectedCategory) {
                return res.status(404).json({
                    success:false,
                    message:'Data Not Found',
                });
            }
            //get coursesfor different categories
            const differentCategories = await Category.find({
                                         _id: {$ne: categoryId},//ne->not equal
                                         })
                                         .populate("courses")
                                         .exec();

            //get top 10 selling courses
            //HW - write it on your own

            //return response
            return res.status(200).json({
                success:true,
                data: {
                    selectedCategory,
                    differentCategories,
                },
            });

    }
    catch(error ) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


// The part
// {name: true, description: true}


// in this line:
// const allTags = await Tags.find({}, { name: true, description: true });

// is called a projection in MongoDB / Mongoose.


// Let’s break it down 

// What .find() does

// The .find() method in Mongoose has the general form:

// Model.find(filter, projection)


// The first argument (filter) specifies which documents to find.
// Here it's {}, meaning find all documents.

// The second argument (projection) specifies which fields to include or exclude from the results.

// In your code
// {name: true, description: true}

// means:

// Return only the name and description fields from each tag document.
// (And by default, the _id field will also be included unless you explicitly exclude it.)

// Example

// Suppose your collection has documents like:

// {
//   _id: "1",
//   name: "Web Development",
//   description: "All about web dev",
//   createdAt: "2025-10-24T00:00Z"
// }


// Then this query:

// await Tags.find({}, { name: true, description: true });


// returns:

// [
//   {
//     _id: "1",
//     name: "Web Development",
//     description: "All about web dev"
//   }
// ]


// But if you did:

// await Tags.find({}, { name: true, _id: false });


// you’d get:

// [
//   {
//     name: "Web Development"
//   }
// ]

// Summary

// { name: true, description: true }
// → means "only include these two fields" from each document when sending the response.

// It’s used to:

// Reduce unnecessary data transfer

// Make responses lighter and cleaner

// Improve performance for large datasets