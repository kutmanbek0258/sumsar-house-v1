const { faqService: {
    addFAQ,
    getFAQ,
    removeFAQ
} } = require("./../services");

exports.addFAQ = async function (req, res) {
    const title = req.body.title;
    const content = req.body.content;
    const contacts = req.body.contacts;
    const link = req.body.link;

    await addFAQ(title, content, contacts, link)

        .then(result => res.status(result.status).json({ message: result.message }))

        .catch(err => res.status(err.status).json({ message: err.message }))

}

exports.getFAQ = async function (req, res) {

    await getFAQ()

        .then(result => res.status(result.status).json(result.faq))

        .catch(err => res.status(err.status).json({message: err.message}));

}

exports.removeFAQ = async function (req, res) {
    const { _id } = req.body;

    await removeFAQ(_id)

        .then(result => res.status(result.status).json({message: "removed success"}))

        .catch(err => res.status(err.status).json({message: err.message}))
}